from sqlalchemy import Column, String, Text, Integer, Boolean, DateTime, UUID, ForeignKey
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import uuid

class SharedResource(Base):
    __tablename__ = "shared_resources"
    
    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False)
    url = Column(String(500))
    description = Column(Text)
    resource_type = Column(String(50))  # link, book, video, audio
    submitted_by = Column(PG_UUID(as_uuid=True), ForeignKey("users.id"))
    upvotes = Column(Integer, default=0)
    downvotes = Column(Integer, default=0)
    is_approved = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    submitter = relationship("User")
