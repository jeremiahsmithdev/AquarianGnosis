from pydantic import BaseModel, validator
from typing import Optional, List
from datetime import datetime
from uuid import UUID

# Shared Resource schemas
class SharedResourceBase(BaseModel):
    title: str
    url: Optional[str] = None
    description: Optional[str] = None
    resource_type: str

class SharedResourceCreate(SharedResourceBase):
    @validator('title')
    def validate_title(cls, v):
        if len(v.strip()) == 0:
            raise ValueError('Resource title cannot be empty')
        if len(v) > 255:
            raise ValueError('Resource title cannot exceed 255 characters')
        return v
    
    @validator('resource_type')
    def validate_resource_type(cls, v):
        if v not in ['link', 'book', 'video', 'audio']:
            raise ValueError('Resource type must be link, book, video, or audio')
        return v

class SharedResourceUpdate(BaseModel):
    title: Optional[str] = None
    url: Optional[str] = None
    description: Optional[str] = None
    resource_type: Optional[str] = None
    is_approved: Optional[bool] = None

class SharedResourceInDB(SharedResourceBase):
    id: UUID
    submitted_by: UUID
    upvotes: int = 0
    downvotes: int = 0
    is_approved: bool = False
    created_at: datetime
    
    class Config:
        from_attributes = True

class SharedResource(SharedResourceInDB):
    pass
