"""Pydantic schemas for admin dashboard endpoints.

Provides request/response schemas for:
- Dashboard statistics
- User management
- Content moderation
"""
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from uuid import UUID


class DashboardStats(BaseModel):
    """Site-wide statistics for admin dashboard overview."""
    total_users: int
    active_users: int
    admin_users: int
    total_forum_threads: int
    total_forum_replies: int
    pending_resources: int
    approved_resources: int
    total_study_groups: int
    users_created_last_7_days: int
    users_created_last_30_days: int


class AdminUserResponse(BaseModel):
    """User data as seen by administrators."""
    id: UUID
    username: str
    email: Optional[str] = None
    is_verified: bool
    is_active: bool
    is_admin: bool
    created_at: datetime
    updated_at: datetime
    location_count: int = 0
    auth_provider: Optional[str] = None
    telegram_username: Optional[str] = None

    class Config:
        from_attributes = True


class AdminUserUpdate(BaseModel):
    """Fields an admin can update on a user."""
    is_active: Optional[bool] = None
    is_admin: Optional[bool] = None
    is_verified: Optional[bool] = None


class UserListResponse(BaseModel):
    """Paginated user list response."""
    users: List[AdminUserResponse]
    total: int
    page: int
    page_size: int


class PendingResourceResponse(BaseModel):
    """Shared resource pending approval."""
    id: UUID
    title: str
    url: Optional[str] = None
    description: Optional[str] = None
    resource_type: str
    submitted_by: UUID
    submitter_username: str
    upvotes: int = 0
    downvotes: int = 0
    created_at: datetime

    class Config:
        from_attributes = True


class CategoryCreate(BaseModel):
    """Request body for creating a forum category."""
    name: str
    description: Optional[str] = None
    display_order: int = 0
