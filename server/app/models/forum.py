from sqlalchemy import Column, String, Text, Integer, Boolean, DateTime, UUID, ForeignKey
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import uuid

class ForumCategory(Base):
    __tablename__ = "forum_categories"
    
    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False)
    description = Column(Text)
    display_order = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    threads = relationship("ForumThread", back_populates="category")

class ForumThread(Base):
    __tablename__ = "forum_threads"
    
    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    category_id = Column(PG_UUID(as_uuid=True), ForeignKey("forum_categories.id"))
    author_id = Column(PG_UUID(as_uuid=True), ForeignKey("users.id"))
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    upvotes = Column(Integer, default=0)
    downvotes = Column(Integer, default=0)
    is_pinned = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    category = relationship("ForumCategory", back_populates="threads")
    author = relationship("User")
    replies = relationship("ForumReply", back_populates="thread", cascade="all, delete-orphan")

class ForumReply(Base):
    __tablename__ = "forum_replies"
    
    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    thread_id = Column(PG_UUID(as_uuid=True), ForeignKey("forum_threads.id", ondelete="CASCADE"), nullable=False)
    author_id = Column(PG_UUID(as_uuid=True), ForeignKey("users.id"))
    content = Column(Text, nullable=False)
    parent_reply_id = Column(PG_UUID(as_uuid=True), ForeignKey("forum_replies.id"))
    upvotes = Column(Integer, default=0)
    downvotes = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    thread = relationship("ForumThread", back_populates="replies")
    author = relationship("User")
    parent_reply = relationship("ForumReply", remote_side=[id])
