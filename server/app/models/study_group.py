from sqlalchemy import Column, String, Text, Integer, Boolean, DateTime, UUID, ForeignKey
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import uuid

class StudyGroup(Base):
    __tablename__ = "study_groups"
    
    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False)
    description = Column(Text)
    creator_id = Column(PG_UUID(as_uuid=True), ForeignKey("users.id"))
    is_location_based = Column(Boolean, default=True)
    max_members = Column(Integer, default=20)
    is_public = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    creator = relationship("User")
    members = relationship("StudyGroupMember", back_populates="group", cascade="all, delete-orphan")

class StudyGroupMember(Base):
    __tablename__ = "study_group_members"
    
    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    group_id = Column(PG_UUID(as_uuid=True), ForeignKey("study_groups.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(PG_UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    role = Column(String(20), default="member")  # member, moderator, admin
    joined_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    group = relationship("StudyGroup", back_populates="members")
    user = relationship("User")
