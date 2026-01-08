"""Pydantic schemas for About page review/edit system.

Provides request/response schemas for content blocks, comments, and edit suggestions.
"""
from pydantic import BaseModel, validator
from typing import Optional, List
from datetime import datetime
from uuid import UUID


# Content Block Schemas
class ContentBlockBase(BaseModel):
    block_type: str
    block_key: str
    display_order: int
    content: str
    parent_block_id: Optional[UUID] = None

    @validator('block_type')
    def validate_block_type(cls, v):
        valid_types = ['header', 'section', 'quote', 'paragraph', 'footer', 'list']
        if v not in valid_types:
            raise ValueError(f'block_type must be one of: {", ".join(valid_types)}')
        return v


class ContentBlockCreate(ContentBlockBase):
    pass


class ContentBlockUpdate(BaseModel):
    content: Optional[str] = None
    display_order: Optional[int] = None
    is_active: Optional[bool] = None


class ContentBlock(ContentBlockBase):
    id: UUID
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ContentBlockWithAnnotations(ContentBlock):
    """Content block with its comments and pending suggestions."""
    comments: List["Comment"] = []
    suggestions: List["EditSuggestion"] = []


# Comment Schemas
class CommentBase(BaseModel):
    block_id: UUID
    start_offset: int
    end_offset: int
    selected_text: str
    content: str

    @validator('content')
    def validate_content(cls, v):
        if len(v.strip()) == 0:
            raise ValueError('Comment content cannot be empty')
        if len(v) > 2000:
            raise ValueError('Comment cannot exceed 2000 characters')
        return v

    @validator('end_offset')
    def validate_offsets(cls, v, values):
        if 'start_offset' in values and v <= values['start_offset']:
            raise ValueError('end_offset must be greater than start_offset')
        return v


class CommentCreate(CommentBase):
    pass


class CommentReplyCreate(BaseModel):
    content: str

    @validator('content')
    def validate_content(cls, v):
        if len(v.strip()) == 0:
            raise ValueError('Reply content cannot be empty')
        if len(v) > 1000:
            raise ValueError('Reply cannot exceed 1000 characters')
        return v


class CommentReply(BaseModel):
    id: UUID
    comment_id: UUID
    author_id: UUID
    author_username: Optional[str] = None
    content: str
    created_at: datetime

    class Config:
        from_attributes = True


class Comment(CommentBase):
    id: UUID
    author_id: UUID
    author_username: Optional[str] = None
    is_resolved: bool
    resolved_by: Optional[UUID] = None
    resolved_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    replies: List[CommentReply] = []

    class Config:
        from_attributes = True


# Edit Suggestion Schemas
class EditSuggestionBase(BaseModel):
    block_id: UUID
    start_offset: int
    end_offset: int
    original_text: str
    suggested_text: str

    @validator('suggested_text')
    def validate_suggested_text(cls, v, values):
        if 'original_text' in values and v == values['original_text']:
            raise ValueError('Suggested text must be different from original text')
        return v

    @validator('end_offset')
    def validate_offsets(cls, v, values):
        if 'start_offset' in values and v <= values['start_offset']:
            raise ValueError('end_offset must be greater than start_offset')
        return v


class EditSuggestionCreate(EditSuggestionBase):
    pass


class EditSuggestionReview(BaseModel):
    review_note: Optional[str] = None


class EditSuggestion(EditSuggestionBase):
    id: UUID
    author_id: UUID
    author_username: Optional[str] = None
    status: str  # pending, accepted, rejected
    reviewed_by: Optional[UUID] = None
    reviewed_at: Optional[datetime] = None
    review_note: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


# Response Models
class AboutContentResponse(BaseModel):
    """Full About page content with all annotations."""
    blocks: List[ContentBlockWithAnnotations]
    can_edit: bool = False  # Whether current user is admin


class PendingReviewResponse(BaseModel):
    """Pending items for admin review."""
    comments: List[Comment]
    suggestions: List[EditSuggestion]
    total_pending: int


# Update forward references
ContentBlockWithAnnotations.model_rebuild()
