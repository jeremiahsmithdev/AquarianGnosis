"""API endpoints for About page review/edit system.

Provides endpoints for:
- Content blocks (public read, admin edit)
- Comments (authenticated users)
- Edit suggestions (authenticated users, admin review)
"""
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from uuid import UUID
from datetime import datetime

from app.core.database import get_db
from app.api.auth import get_current_user, security
from app.models.user import User
from app.models.about import (
    AboutContentBlock,
    AboutComment,
    AboutCommentReply,
    AboutEditSuggestion,
    AboutContentHistory
)
from app.schemas.about import (
    ContentBlock,
    ContentBlockWithAnnotations,
    ContentBlockUpdate,
    Comment,
    CommentCreate,
    CommentReply,
    CommentReplyCreate,
    EditSuggestion,
    EditSuggestionCreate,
    EditSuggestionReview,
    AboutContentResponse,
    PendingReviewResponse
)
import re
from html import unescape

router = APIRouter()


def apply_text_replacement(
    html_content: str,
    start_offset: int,
    end_offset: int,
    original_text: str,
    replacement_text: str
) -> str:
    """
    Apply a text replacement to HTML content using plain text offsets.

    The offsets are based on the visible text (without HTML tags).
    This function finds the corresponding positions in the HTML and
    applies the replacement while preserving HTML structure.
    """
    # Convert newlines in replacement text to <br> tags for HTML display
    replacement_text = replacement_text.replace('\n', '<br>')

    # First, try to find the original_text in the plain text and verify offsets
    # Strip HTML tags to get plain text
    plain_text = re.sub(r'<[^>]+>', '', html_content)
    plain_text = unescape(plain_text)

    # Verify the original text matches at the given offsets
    extracted = plain_text[start_offset:end_offset]
    if extracted != original_text:
        # Offsets don't match - try to find the text directly in HTML
        # This handles simple cases where the text isn't split across tags
        if original_text in html_content:
            return html_content.replace(original_text, replacement_text, 1)
        # If we can't find it, return unchanged
        return html_content

    # Map plain text offset to HTML offset
    html_index = 0
    text_index = 0
    html_start = None
    html_end = None

    while html_index < len(html_content) and text_index <= end_offset:
        # Skip HTML tags
        if html_content[html_index] == '<':
            tag_end = html_content.find('>', html_index)
            if tag_end != -1:
                html_index = tag_end + 1
                continue

        # Handle HTML entities
        if html_content[html_index] == '&':
            entity_end = html_content.find(';', html_index)
            if entity_end != -1 and entity_end - html_index < 10:
                if text_index == start_offset:
                    html_start = html_index
                text_index += 1
                if text_index == end_offset:
                    html_end = entity_end + 1
                    break
                html_index = entity_end + 1
                continue

        # Regular character
        if text_index == start_offset:
            html_start = html_index
        text_index += 1
        if text_index == end_offset:
            html_end = html_index + 1
            break
        html_index += 1

    if html_start is not None and html_end is not None:
        return html_content[:html_start] + replacement_text + html_content[html_end:]

    # Fallback: try simple string replacement
    if original_text in html_content:
        return html_content.replace(original_text, replacement_text, 1)

    return html_content


# Helper: Get current user (optional - for public endpoints)
async def get_optional_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(
        HTTPBearer(auto_error=False)
    ),
    db: Session = Depends(get_db)
) -> Optional[User]:
    """Get current user if authenticated, None otherwise."""
    if credentials is None:
        return None
    from app.core.security import verify_token
    username = verify_token(credentials.credentials)
    if username is None:
        return None
    return db.query(User).filter(User.username == username).first()


# Helper: Require admin user
async def get_current_admin(
    current_user: User = Depends(get_current_user)
) -> User:
    """Require authenticated user with admin privileges."""
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required"
        )
    return current_user


def add_username_to_comment(comment: AboutComment) -> dict:
    """Add author_username to comment data."""
    data = {
        "id": comment.id,
        "block_id": comment.block_id,
        "author_id": comment.author_id,
        "author_username": comment.author.username if comment.author else None,
        "start_offset": comment.start_offset,
        "end_offset": comment.end_offset,
        "selected_text": comment.selected_text,
        "content": comment.content,
        "is_resolved": comment.is_resolved,
        "resolved_by": comment.resolved_by,
        "resolved_at": comment.resolved_at,
        "created_at": comment.created_at,
        "updated_at": comment.updated_at,
        "replies": [
            {
                "id": reply.id,
                "comment_id": reply.comment_id,
                "author_id": reply.author_id,
                "author_username": reply.author.username if reply.author else None,
                "content": reply.content,
                "created_at": reply.created_at
            }
            for reply in comment.replies
        ]
    }
    return data


def add_username_to_suggestion(suggestion: AboutEditSuggestion) -> dict:
    """Add author_username to suggestion data."""
    return {
        "id": suggestion.id,
        "block_id": suggestion.block_id,
        "author_id": suggestion.author_id,
        "author_username": suggestion.author.username if suggestion.author else None,
        "start_offset": suggestion.start_offset,
        "end_offset": suggestion.end_offset,
        "original_text": suggestion.original_text,
        "suggested_text": suggestion.suggested_text,
        "status": suggestion.status,
        "reviewed_by": suggestion.reviewed_by,
        "reviewed_at": suggestion.reviewed_at,
        "review_note": suggestion.review_note,
        "created_at": suggestion.created_at
    }


# ============== Content Endpoints ==============

@router.get("/content", response_model=AboutContentResponse)
async def get_about_content(
    current_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db)
):
    """Get all About page content blocks with comments and suggestions."""
    blocks = (
        db.query(AboutContentBlock)
        .filter(AboutContentBlock.is_active == True)
        .options(
            joinedload(AboutContentBlock.comments).joinedload(AboutComment.author),
            joinedload(AboutContentBlock.comments).joinedload(AboutComment.replies).joinedload(AboutCommentReply.author),
            joinedload(AboutContentBlock.suggestions).joinedload(AboutEditSuggestion.author)
        )
        .order_by(AboutContentBlock.display_order)
        .all()
    )

    # Build response with annotations
    blocks_with_annotations = []
    for block in blocks:
        # Only show unresolved comments and pending suggestions to non-admins
        if current_user and current_user.is_admin:
            comments = [add_username_to_comment(c) for c in block.comments]
            suggestions = [add_username_to_suggestion(s) for s in block.suggestions]
        elif current_user:
            # Authenticated non-admin: show unresolved comments and pending suggestions
            comments = [
                add_username_to_comment(c)
                for c in block.comments
                if not c.is_resolved
            ]
            suggestions = [
                add_username_to_suggestion(s)
                for s in block.suggestions
                if s.status == "pending"
            ]
        else:
            # Public: no comments or suggestions
            comments = []
            suggestions = []

        blocks_with_annotations.append({
            "id": block.id,
            "block_type": block.block_type,
            "block_key": block.block_key,
            "display_order": block.display_order,
            "content": block.content,
            "parent_block_id": block.parent_block_id,
            "is_active": block.is_active,
            "created_at": block.created_at,
            "updated_at": block.updated_at,
            "comments": comments,
            "suggestions": suggestions
        })

    return {
        "blocks": blocks_with_annotations,
        "can_edit": current_user.is_admin if current_user else False
    }


@router.put("/content/{block_id}", response_model=ContentBlock)
async def update_content_block(
    block_id: UUID,
    update: ContentBlockUpdate,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Update a content block (admin only)."""
    block = db.query(AboutContentBlock).filter(AboutContentBlock.id == block_id).first()
    if not block:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Content block not found"
        )

    if update.content is not None:
        block.content = update.content
    if update.display_order is not None:
        block.display_order = update.display_order
    if update.is_active is not None:
        block.is_active = update.is_active

    db.commit()
    db.refresh(block)
    return block


# ============== Comment Endpoints ==============

@router.get("/comments", response_model=List[Comment])
async def get_comments(
    block_id: Optional[UUID] = None,
    include_resolved: bool = False,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get comments, optionally filtered by block."""
    query = (
        db.query(AboutComment)
        .options(
            joinedload(AboutComment.author),
            joinedload(AboutComment.replies).joinedload(AboutCommentReply.author)
        )
    )

    if block_id:
        query = query.filter(AboutComment.block_id == block_id)

    if not include_resolved and not current_user.is_admin:
        query = query.filter(AboutComment.is_resolved == False)

    comments = query.order_by(AboutComment.created_at.desc()).all()
    return [add_username_to_comment(c) for c in comments]


@router.post("/comments", response_model=Comment)
async def create_comment(
    comment: CommentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a comment on a text selection."""
    # Verify block exists
    block = db.query(AboutContentBlock).filter(AboutContentBlock.id == comment.block_id).first()
    if not block:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Content block not found"
        )

    db_comment = AboutComment(
        block_id=comment.block_id,
        author_id=current_user.id,
        start_offset=comment.start_offset,
        end_offset=comment.end_offset,
        selected_text=comment.selected_text,
        content=comment.content
    )

    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)

    # Load author relationship
    db_comment = (
        db.query(AboutComment)
        .options(joinedload(AboutComment.author))
        .filter(AboutComment.id == db_comment.id)
        .first()
    )

    return add_username_to_comment(db_comment)


@router.delete("/comments/{comment_id}")
async def delete_comment(
    comment_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a comment (owner or admin only)."""
    comment = db.query(AboutComment).filter(AboutComment.id == comment_id).first()
    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment not found"
        )

    if comment.author_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this comment"
        )

    db.delete(comment)
    db.commit()
    return {"message": "Comment deleted"}


@router.post("/comments/{comment_id}/resolve", response_model=Comment)
async def resolve_comment(
    comment_id: UUID,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Resolve a comment (admin only)."""
    comment = (
        db.query(AboutComment)
        .options(
            joinedload(AboutComment.author),
            joinedload(AboutComment.replies).joinedload(AboutCommentReply.author)
        )
        .filter(AboutComment.id == comment_id)
        .first()
    )
    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment not found"
        )

    comment.is_resolved = True
    comment.resolved_by = current_admin.id
    comment.resolved_at = datetime.utcnow()

    db.commit()
    db.refresh(comment)
    return add_username_to_comment(comment)


@router.post("/comments/{comment_id}/reply", response_model=CommentReply)
async def reply_to_comment(
    comment_id: UUID,
    reply: CommentReplyCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Reply to a comment."""
    comment = db.query(AboutComment).filter(AboutComment.id == comment_id).first()
    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment not found"
        )

    db_reply = AboutCommentReply(
        comment_id=comment_id,
        author_id=current_user.id,
        content=reply.content
    )

    db.add(db_reply)
    db.commit()
    db.refresh(db_reply)

    # Load author
    db_reply = (
        db.query(AboutCommentReply)
        .options(joinedload(AboutCommentReply.author))
        .filter(AboutCommentReply.id == db_reply.id)
        .first()
    )

    return {
        "id": db_reply.id,
        "comment_id": db_reply.comment_id,
        "author_id": db_reply.author_id,
        "author_username": db_reply.author.username if db_reply.author else None,
        "content": db_reply.content,
        "created_at": db_reply.created_at
    }


# ============== Edit Suggestion Endpoints ==============

@router.get("/suggestions", response_model=List[EditSuggestion])
async def get_suggestions(
    block_id: Optional[UUID] = None,
    status_filter: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get edit suggestions, optionally filtered."""
    query = (
        db.query(AboutEditSuggestion)
        .options(joinedload(AboutEditSuggestion.author))
    )

    if block_id:
        query = query.filter(AboutEditSuggestion.block_id == block_id)

    if status_filter:
        query = query.filter(AboutEditSuggestion.status == status_filter)
    elif not current_user.is_admin:
        # Non-admins only see pending
        query = query.filter(AboutEditSuggestion.status == "pending")

    suggestions = query.order_by(AboutEditSuggestion.created_at.desc()).all()
    return [add_username_to_suggestion(s) for s in suggestions]


@router.post("/suggestions", response_model=EditSuggestion)
async def create_suggestion(
    suggestion: EditSuggestionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create an edit suggestion."""
    # Verify block exists
    block = db.query(AboutContentBlock).filter(AboutContentBlock.id == suggestion.block_id).first()
    if not block:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Content block not found"
        )

    # Check for overlapping pending suggestions
    overlapping = (
        db.query(AboutEditSuggestion)
        .filter(
            AboutEditSuggestion.block_id == suggestion.block_id,
            AboutEditSuggestion.status == "pending",
            AboutEditSuggestion.start_offset < suggestion.end_offset,
            AboutEditSuggestion.end_offset > suggestion.start_offset
        )
        .first()
    )
    if overlapping:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A pending suggestion already exists for this text range"
        )

    db_suggestion = AboutEditSuggestion(
        block_id=suggestion.block_id,
        author_id=current_user.id,
        start_offset=suggestion.start_offset,
        end_offset=suggestion.end_offset,
        original_text=suggestion.original_text,
        suggested_text=suggestion.suggested_text
    )

    db.add(db_suggestion)
    db.commit()
    db.refresh(db_suggestion)

    # Load author
    db_suggestion = (
        db.query(AboutEditSuggestion)
        .options(joinedload(AboutEditSuggestion.author))
        .filter(AboutEditSuggestion.id == db_suggestion.id)
        .first()
    )

    return add_username_to_suggestion(db_suggestion)


@router.delete("/suggestions/{suggestion_id}")
async def delete_suggestion(
    suggestion_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete own pending suggestion."""
    suggestion = db.query(AboutEditSuggestion).filter(AboutEditSuggestion.id == suggestion_id).first()
    if not suggestion:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Suggestion not found"
        )

    if suggestion.author_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this suggestion"
        )

    if suggestion.status != "pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Can only delete pending suggestions"
        )

    db.delete(suggestion)
    db.commit()
    return {"message": "Suggestion deleted"}


@router.post("/suggestions/{suggestion_id}/accept", response_model=EditSuggestion)
async def accept_suggestion(
    suggestion_id: UUID,
    review: EditSuggestionReview = None,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Accept an edit suggestion and apply the change (admin only)."""
    suggestion = (
        db.query(AboutEditSuggestion)
        .options(joinedload(AboutEditSuggestion.author))
        .filter(AboutEditSuggestion.id == suggestion_id)
        .first()
    )
    if not suggestion:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Suggestion not found"
        )

    if suggestion.status != "pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Suggestion is not pending"
        )

    # Get the block and apply the edit
    block = db.query(AboutContentBlock).filter(AboutContentBlock.id == suggestion.block_id).first()
    old_content = None
    new_content = None

    if block:
        # Store old content for history
        old_content = block.content

        # Apply the text replacement (convert plain text offsets to HTML offsets)
        new_content = apply_text_replacement(
            old_content,
            suggestion.start_offset,
            suggestion.end_offset,
            suggestion.original_text,
            suggestion.suggested_text
        )
        block.content = new_content

        # Log to changelog
        history_entry = AboutContentHistory(
            block_id=block.id,
            block_key=block.block_key,
            change_type="suggestion_accepted",
            changed_by=current_admin.id,
            suggestion_id=suggestion.id,
            original_text=suggestion.original_text,
            new_text=suggestion.suggested_text,
            full_content_before=old_content,
            full_content_after=new_content,
            note=review.review_note if review and review.review_note else None
        )
        db.add(history_entry)

    # Mark suggestion as accepted
    suggestion.status = "accepted"
    suggestion.reviewed_by = current_admin.id
    suggestion.reviewed_at = datetime.utcnow()
    if review and review.review_note:
        suggestion.review_note = review.review_note

    db.commit()
    db.refresh(suggestion)
    return add_username_to_suggestion(suggestion)


@router.post("/suggestions/{suggestion_id}/reject", response_model=EditSuggestion)
async def reject_suggestion(
    suggestion_id: UUID,
    review: EditSuggestionReview = None,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Reject an edit suggestion (admin only)."""
    suggestion = (
        db.query(AboutEditSuggestion)
        .options(joinedload(AboutEditSuggestion.author))
        .filter(AboutEditSuggestion.id == suggestion_id)
        .first()
    )
    if not suggestion:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Suggestion not found"
        )

    if suggestion.status != "pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Suggestion is not pending"
        )

    suggestion.status = "rejected"
    suggestion.reviewed_by = current_admin.id
    suggestion.reviewed_at = datetime.utcnow()
    if review and review.review_note:
        suggestion.review_note = review.review_note

    db.commit()
    db.refresh(suggestion)
    return add_username_to_suggestion(suggestion)


# ============== Admin Endpoints ==============

@router.get("/admin/pending", response_model=PendingReviewResponse)
async def get_pending_items(
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Get all pending comments and suggestions for admin review."""
    comments = (
        db.query(AboutComment)
        .options(
            joinedload(AboutComment.author),
            joinedload(AboutComment.replies).joinedload(AboutCommentReply.author)
        )
        .filter(AboutComment.is_resolved == False)
        .order_by(AboutComment.created_at.desc())
        .all()
    )

    suggestions = (
        db.query(AboutEditSuggestion)
        .options(joinedload(AboutEditSuggestion.author))
        .filter(AboutEditSuggestion.status == "pending")
        .order_by(AboutEditSuggestion.created_at.desc())
        .all()
    )

    return {
        "comments": [add_username_to_comment(c) for c in comments],
        "suggestions": [add_username_to_suggestion(s) for s in suggestions],
        "total_pending": len(comments) + len(suggestions)
    }
