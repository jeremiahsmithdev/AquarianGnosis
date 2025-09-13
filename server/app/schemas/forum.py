from pydantic import BaseModel, validator
from typing import Optional, List
from datetime import datetime
from uuid import UUID

# Forum Category schemas
class ForumCategoryBase(BaseModel):
    name: str
    description: Optional[str] = None
    display_order: Optional[int] = 0

class ForumCategoryCreate(ForumCategoryBase):
    pass

class ForumCategoryUpdate(ForumCategoryBase):
    name: Optional[str] = None

class ForumCategoryInDB(ForumCategoryBase):
    id: UUID
    created_at: datetime
    
    class Config:
        from_attributes = True

class ForumCategory(ForumCategoryInDB):
    pass

# Forum Thread schemas
class ForumThreadBase(BaseModel):
    title: str
    content: str
    category_id: UUID
    is_pinned: Optional[bool] = False

class ForumThreadCreate(ForumThreadBase):
    @validator('title')
    def validate_title(cls, v):
        if len(v.strip()) == 0:
            raise ValueError('Thread title cannot be empty')
        if len(v) > 255:
            raise ValueError('Thread title cannot exceed 255 characters')
        return v
    
    @validator('content')
    def validate_content(cls, v):
        if len(v.strip()) == 0:
            raise ValueError('Thread content cannot be empty')
        return v

class ForumThreadUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    is_pinned: Optional[bool] = None
    
    @validator('title')
    def validate_title(cls, v):
        if v is not None and len(v.strip()) == 0:
            raise ValueError('Thread title cannot be empty')
        if v is not None and len(v) > 255:
            raise ValueError('Thread title cannot exceed 255 characters')
        return v
    
    @validator('content')
    def validate_content(cls, v):
        if v is not None and len(v.strip()) == 0:
            raise ValueError('Thread content cannot be empty')
        return v

class ForumThreadInDB(ForumThreadBase):
    id: UUID
    author_id: UUID
    upvotes: int = 0
    downvotes: int = 0
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class ForumThread(ForumThreadInDB):
    pass

# Forum Reply schemas
class ForumReplyBase(BaseModel):
    content: str
    thread_id: UUID
    parent_reply_id: Optional[UUID] = None

class ForumReplyCreate(ForumReplyBase):
    @validator('content')
    def validate_content(cls, v):
        if len(v.strip()) == 0:
            raise ValueError('Reply content cannot be empty')
        return v

class ForumReplyUpdate(BaseModel):
    content: Optional[str] = None
    
    @validator('content')
    def validate_content(cls, v):
        if v is not None and len(v.strip()) == 0:
            raise ValueError('Reply content cannot be empty')
        return v

class ForumReplyInDB(ForumReplyBase):
    id: UUID
    author_id: UUID
    upvotes: int = 0
    downvotes: int = 0
    created_at: datetime
    
    class Config:
        from_attributes = True

class ForumReply(ForumReplyInDB):
    pass
