"""SQLAlchemy models for About page review/edit system.

Provides models for:
- AboutContentBlock: Stores page content in blocks
- AboutComment: User comments on text selections
- AboutCommentReply: Replies to comments
- AboutEditSuggestion: Suggested text edits
- AboutContentHistory: Changelog of all content modifications
"""
from sqlalchemy import Column, String, Boolean, DateTime, Text, Integer, ForeignKey
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import uuid


class AboutContentBlock(Base):
    """Stores About page content as discrete blocks for editing."""
    __tablename__ = "about_content_blocks"

    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    block_type = Column(String(50), nullable=False)  # header, section, quote, paragraph, footer
    block_key = Column(String(100), unique=True, nullable=False, index=True)
    display_order = Column(Integer, nullable=False, index=True)
    content = Column(Text, nullable=False)
    parent_block_id = Column(PG_UUID(as_uuid=True), ForeignKey("about_content_blocks.id", ondelete="CASCADE"), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    parent = relationship("AboutContentBlock", remote_side=[id], backref="children")
    comments = relationship("AboutComment", back_populates="block", cascade="all, delete-orphan")
    suggestions = relationship("AboutEditSuggestion", back_populates="block", cascade="all, delete-orphan")


class AboutComment(Base):
    """User comment on a text selection within a content block."""
    __tablename__ = "about_comments"

    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    block_id = Column(PG_UUID(as_uuid=True), ForeignKey("about_content_blocks.id", ondelete="CASCADE"), nullable=False, index=True)
    author_id = Column(PG_UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    start_offset = Column(Integer, nullable=False)
    end_offset = Column(Integer, nullable=False)
    selected_text = Column(Text, nullable=False)
    content = Column(Text, nullable=False)
    is_resolved = Column(Boolean, default=False, nullable=False)
    resolved_by = Column(PG_UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    resolved_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    block = relationship("AboutContentBlock", back_populates="comments")
    author = relationship("User", foreign_keys=[author_id])
    resolver = relationship("User", foreign_keys=[resolved_by])
    replies = relationship("AboutCommentReply", back_populates="comment", cascade="all, delete-orphan")


class AboutCommentReply(Base):
    """Reply to a comment thread."""
    __tablename__ = "about_comment_replies"

    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    comment_id = Column(PG_UUID(as_uuid=True), ForeignKey("about_comments.id", ondelete="CASCADE"), nullable=False, index=True)
    author_id = Column(PG_UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    comment = relationship("AboutComment", back_populates="replies")
    author = relationship("User", foreign_keys=[author_id])


class AboutEditSuggestion(Base):
    """Suggested text edit awaiting admin review."""
    __tablename__ = "about_edit_suggestions"

    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    block_id = Column(PG_UUID(as_uuid=True), ForeignKey("about_content_blocks.id", ondelete="CASCADE"), nullable=False, index=True)
    author_id = Column(PG_UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    start_offset = Column(Integer, nullable=False)
    end_offset = Column(Integer, nullable=False)
    original_text = Column(Text, nullable=False)
    suggested_text = Column(Text, nullable=False)
    status = Column(String(20), default="pending", nullable=False, index=True)  # pending, accepted, rejected
    reviewed_by = Column(PG_UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    reviewed_at = Column(DateTime(timezone=True), nullable=True)
    review_note = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    block = relationship("AboutContentBlock", back_populates="suggestions")
    author = relationship("User", foreign_keys=[author_id])
    reviewer = relationship("User", foreign_keys=[reviewed_by])


class AboutContentHistory(Base):
    """Changelog entry for tracking all content modifications."""
    __tablename__ = "about_content_history"

    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    block_id = Column(PG_UUID(as_uuid=True), ForeignKey("about_content_blocks.id", ondelete="CASCADE"), nullable=False, index=True)
    block_key = Column(String(100), nullable=False)  # Denormalized for easier querying
    change_type = Column(String(50), nullable=False)  # 'suggestion_accepted', 'direct_edit', 'content_created'
    changed_by = Column(PG_UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    suggestion_id = Column(PG_UUID(as_uuid=True), ForeignKey("about_edit_suggestions.id", ondelete="SET NULL"), nullable=True)
    original_text = Column(Text, nullable=True)  # What was replaced
    new_text = Column(Text, nullable=True)  # What it was replaced with
    full_content_before = Column(Text, nullable=True)  # Full block content before change
    full_content_after = Column(Text, nullable=True)  # Full block content after change
    note = Column(Text, nullable=True)  # Optional note about the change
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    block = relationship("AboutContentBlock")
    user = relationship("User", foreign_keys=[changed_by])
    suggestion = relationship("AboutEditSuggestion", foreign_keys=[suggestion_id])
