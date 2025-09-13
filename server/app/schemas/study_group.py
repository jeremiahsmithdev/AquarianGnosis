from pydantic import BaseModel, validator
from typing import Optional, List
from datetime import datetime
from uuid import UUID

# Study Group schemas
class StudyGroupBase(BaseModel):
    name: str
    description: Optional[str] = None
    is_location_based: Optional[bool] = True
    max_members: Optional[int] = 20
    is_public: Optional[bool] = True

class StudyGroupCreate(StudyGroupBase):
    @validator('name')
    def validate_name(cls, v):
        if len(v.strip()) == 0:
            raise ValueError('Study group name cannot be empty')
        if len(v) > 100:
            raise ValueError('Study group name cannot exceed 100 characters')
        return v

class StudyGroupUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    is_location_based: Optional[bool] = None
    max_members: Optional[int] = None
    is_public: Optional[bool] = None

class StudyGroupInDB(StudyGroupBase):
    id: UUID
    creator_id: UUID
    created_at: datetime
    
    class Config:
        from_attributes = True

class StudyGroup(StudyGroupInDB):
    pass

# Study Group Member schemas
class StudyGroupMemberBase(BaseModel):
    group_id: UUID
    user_id: UUID
    role: Optional[str] = "member"

class StudyGroupMemberCreate(BaseModel):
    group_id: UUID

class StudyGroupMemberUpdate(BaseModel):
    role: Optional[str] = None

class StudyGroupMemberInDB(StudyGroupMemberBase):
    id: UUID
    joined_at: datetime
    
    class Config:
        from_attributes = True

class StudyGroupMember(StudyGroupMemberInDB):
    pass
