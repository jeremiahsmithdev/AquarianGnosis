from pydantic import BaseModel, EmailStr, validator
from typing import Optional, List
from datetime import datetime
from uuid import UUID
from decimal import Decimal

# User schemas
class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str
    
    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        return v
    
    @validator('username')
    def validate_username(cls, v):
        if len(v) < 3:
            raise ValueError('Username must be at least 3 characters long')
        if not v.replace('_', '').replace('-', '').isalnum():
            raise ValueError('Username can only contain letters, numbers, hyphens, and underscores')
        return v

class UserLogin(BaseModel):
    username: str
    password: str

class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None

class UserInDB(UserBase):
    id: UUID
    is_verified: bool
    is_active: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class User(UserInDB):
    pass

# Location schemas
class LocationBase(BaseModel):
    latitude: Decimal
    longitude: Decimal
    is_public: bool = True
    status: str = "permanent"
    
    @validator('latitude')
    def validate_latitude(cls, v):
        if not -90 <= float(v) <= 90:
            raise ValueError('Latitude must be between -90 and 90')
        return v
    
    @validator('longitude')
    def validate_longitude(cls, v):
        if not -180 <= float(v) <= 180:
            raise ValueError('Longitude must be between -180 and 180')
        return v
    
    @validator('status')
    def validate_status(cls, v):
        if v not in ['permanent', 'traveling', 'nomadic']:
            raise ValueError('Status must be permanent, traveling, or nomadic')
        return v

class LocationCreate(LocationBase):
    pass

class LocationUpdate(BaseModel):
    latitude: Optional[Decimal] = None
    longitude: Optional[Decimal] = None
    is_public: Optional[bool] = None
    status: Optional[str] = None
    
    @validator('latitude')
    def validate_latitude(cls, v):
        if v is not None and not -90 <= float(v) <= 90:
            raise ValueError('Latitude must be between -90 and 90')
        return v
    
    @validator('longitude')
    def validate_longitude(cls, v):
        if v is not None and not -180 <= float(v) <= 180:
            raise ValueError('Longitude must be between -180 and 180')
        return v

class LocationInDB(LocationBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class Location(LocationInDB):
    pass

# Message schemas
class MessageBase(BaseModel):
    content: str
    
    @validator('content')
    def validate_content(cls, v):
        if len(v.strip()) == 0:
            raise ValueError('Message content cannot be empty')
        if len(v) > 5000:
            raise ValueError('Message content cannot exceed 5000 characters')
        return v

class MessageCreate(MessageBase):
    recipient_id: UUID

class MessageInDB(MessageBase):
    id: UUID
    sender_id: UUID
    recipient_id: UUID
    is_read: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class Message(MessageInDB):
    pass

# Token schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None