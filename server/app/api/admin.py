"""Admin dashboard API endpoints.

Provides endpoints for:
- Dashboard statistics and analytics
- User management (list, update, activate/deactivate, promote)
- Content moderation (resources, forum threads/replies)
- Category management
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query, Body
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from typing import List, Optional
from uuid import UUID
from datetime import datetime, timedelta

from app.core.database import get_db
from app.core.dependencies import get_current_admin
from app.core.logging import get_logger
from app.models.user import User, UserLocation
from app.models.forum import ForumCategory, ForumThread, ForumReply
from app.models.resource import SharedResource
from app.models.study_group import StudyGroup
from app.schemas.admin import (
    DashboardStats,
    AdminUserResponse,
    AdminUserUpdate,
    UserListResponse,
    PendingResourceResponse,
    CategoryCreate
)

logger = get_logger(__name__)
router = APIRouter()


# ============== Dashboard Statistics ==============

@router.get("/stats", response_model=DashboardStats)
async def get_dashboard_stats(
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Get comprehensive dashboard statistics."""
    now = datetime.utcnow()
    week_ago = now - timedelta(days=7)
    month_ago = now - timedelta(days=30)

    # User statistics
    total_users = db.query(func.count(User.id)).scalar() or 0
    active_users = db.query(func.count(User.id)).filter(User.is_active == True).scalar() or 0
    admin_users = db.query(func.count(User.id)).filter(User.is_admin == True).scalar() or 0
    users_last_7_days = db.query(func.count(User.id)).filter(User.created_at >= week_ago).scalar() or 0
    users_last_30_days = db.query(func.count(User.id)).filter(User.created_at >= month_ago).scalar() or 0

    # Content statistics
    total_threads = db.query(func.count(ForumThread.id)).scalar() or 0
    total_replies = db.query(func.count(ForumReply.id)).scalar() or 0

    # Resource statistics
    pending_resources = db.query(func.count(SharedResource.id)).filter(
        SharedResource.is_approved == False
    ).scalar() or 0
    approved_resources = db.query(func.count(SharedResource.id)).filter(
        SharedResource.is_approved == True
    ).scalar() or 0

    # Study groups
    total_study_groups = db.query(func.count(StudyGroup.id)).scalar() or 0

    logger.info("Dashboard stats retrieved", admin_id=str(current_admin.id))

    return DashboardStats(
        total_users=total_users,
        active_users=active_users,
        admin_users=admin_users,
        total_forum_threads=total_threads,
        total_forum_replies=total_replies,
        pending_resources=pending_resources,
        approved_resources=approved_resources,
        total_study_groups=total_study_groups,
        users_created_last_7_days=users_last_7_days,
        users_created_last_30_days=users_last_30_days
    )


# ============== User Management ==============

@router.get("/users", response_model=UserListResponse)
async def list_users(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=10000),
    search: Optional[str] = None,
    is_active: Optional[bool] = None,
    is_admin: Optional[bool] = None,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """List all users with pagination and filtering."""
    query = db.query(User)

    # Apply filters
    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            (User.username.ilike(search_pattern)) |
            (User.email.ilike(search_pattern))
        )
    if is_active is not None:
        query = query.filter(User.is_active == is_active)
    if is_admin is not None:
        query = query.filter(User.is_admin == is_admin)

    # Get total count
    total = query.count()

    # Apply pagination
    offset = (page - 1) * page_size
    users = query.order_by(User.created_at.desc()).offset(offset).limit(page_size).all()

    # Build response with location counts
    user_responses = []
    for user in users:
        location_count = db.query(func.count(UserLocation.id)).filter(
            UserLocation.user_id == user.id
        ).scalar() or 0

        user_responses.append(AdminUserResponse(
            id=user.id,
            username=user.username,
            email=user.email,
            is_verified=user.is_verified,
            is_active=user.is_active,
            is_admin=user.is_admin,
            created_at=user.created_at,
            updated_at=user.updated_at,
            location_count=location_count,
            auth_provider=user.auth_provider,
            telegram_username=user.telegram_username
        ))

    return UserListResponse(
        users=user_responses,
        total=total,
        page=page,
        page_size=page_size
    )


@router.get("/users/{user_id}", response_model=AdminUserResponse)
async def get_user(
    user_id: UUID,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Get a specific user's details."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    location_count = db.query(func.count(UserLocation.id)).filter(
        UserLocation.user_id == user.id
    ).scalar() or 0

    return AdminUserResponse(
        id=user.id,
        username=user.username,
        email=user.email,
        is_verified=user.is_verified,
        is_active=user.is_active,
        is_admin=user.is_admin,
        created_at=user.created_at,
        updated_at=user.updated_at,
        location_count=location_count,
        auth_provider=user.auth_provider,
        telegram_username=user.telegram_username
    )


@router.delete("/users/{user_id}")
async def delete_user(
    user_id: UUID,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Delete a user account (admin only)."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Prevent admin from deleting themselves
    if user.id == current_admin.id:
        raise HTTPException(
            status_code=400,
            detail="Cannot delete your own account"
        )

    username = user.username
    db.delete(user)
    db.commit()

    logger.info(
        "User deleted by admin",
        admin_id=str(current_admin.id),
        deleted_user_id=str(user_id),
        deleted_username=username
    )

    return {"message": f"User '{username}' deleted successfully"}


@router.put("/users/{user_id}", response_model=AdminUserResponse)
async def update_user(
    user_id: UUID,
    updates: AdminUserUpdate,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Update a user's admin-editable fields."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Prevent admin from demoting themselves
    if user.id == current_admin.id and updates.is_admin == False:
        raise HTTPException(
            status_code=400,
            detail="Cannot remove your own admin privileges"
        )

    # Apply updates
    if updates.is_active is not None:
        user.is_active = updates.is_active
    if updates.is_admin is not None:
        user.is_admin = updates.is_admin
    if updates.is_verified is not None:
        user.is_verified = updates.is_verified

    db.commit()
    db.refresh(user)

    logger.info(
        "Admin user update",
        admin_id=str(current_admin.id),
        target_user_id=str(user_id),
        updates=updates.model_dump(exclude_unset=True)
    )

    location_count = db.query(func.count(UserLocation.id)).filter(
        UserLocation.user_id == user.id
    ).scalar() or 0

    return AdminUserResponse(
        id=user.id,
        username=user.username,
        email=user.email,
        is_verified=user.is_verified,
        is_active=user.is_active,
        is_admin=user.is_admin,
        created_at=user.created_at,
        updated_at=user.updated_at,
        location_count=location_count,
        auth_provider=user.auth_provider,
        telegram_username=user.telegram_username
    )


# ============== Resource Moderation ==============

@router.get("/resources/pending", response_model=List[PendingResourceResponse])
async def get_pending_resources(
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Get all pending (unapproved) resources."""
    resources = (
        db.query(SharedResource)
        .options(joinedload(SharedResource.submitter))
        .filter(SharedResource.is_approved == False)
        .order_by(SharedResource.created_at.desc())
        .all()
    )

    return [
        PendingResourceResponse(
            id=r.id,
            title=r.title,
            url=r.url,
            description=r.description,
            resource_type=r.resource_type or "link",
            submitted_by=r.submitted_by,
            submitter_username=r.submitter.username if r.submitter else "Unknown",
            upvotes=r.upvotes or 0,
            downvotes=r.downvotes or 0,
            created_at=r.created_at
        )
        for r in resources
    ]


@router.put("/resources/{resource_id}/approve")
async def approve_resource(
    resource_id: UUID,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Approve a pending resource."""
    resource = db.query(SharedResource).filter(SharedResource.id == resource_id).first()
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")

    resource.is_approved = True
    db.commit()

    logger.info("Resource approved", admin_id=str(current_admin.id), resource_id=str(resource_id))
    return {"message": "Resource approved successfully"}


@router.put("/resources/{resource_id}/reject")
async def reject_resource(
    resource_id: UUID,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Reject (delete) a pending resource."""
    resource = db.query(SharedResource).filter(SharedResource.id == resource_id).first()
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")

    db.delete(resource)
    db.commit()

    logger.info("Resource rejected", admin_id=str(current_admin.id), resource_id=str(resource_id))
    return {"message": "Resource rejected and deleted"}


# ============== Forum Moderation ==============

@router.put("/threads/{thread_id}/pin")
async def pin_thread(
    thread_id: UUID,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Pin a forum thread."""
    thread = db.query(ForumThread).filter(ForumThread.id == thread_id).first()
    if not thread:
        raise HTTPException(status_code=404, detail="Thread not found")

    thread.is_pinned = True
    db.commit()

    logger.info("Thread pinned", admin_id=str(current_admin.id), thread_id=str(thread_id))
    return {"message": "Thread pinned successfully"}


@router.put("/threads/{thread_id}/unpin")
async def unpin_thread(
    thread_id: UUID,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Unpin a forum thread."""
    thread = db.query(ForumThread).filter(ForumThread.id == thread_id).first()
    if not thread:
        raise HTTPException(status_code=404, detail="Thread not found")

    thread.is_pinned = False
    db.commit()

    logger.info("Thread unpinned", admin_id=str(current_admin.id), thread_id=str(thread_id))
    return {"message": "Thread unpinned successfully"}


@router.delete("/threads/{thread_id}")
async def delete_thread_admin(
    thread_id: UUID,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Delete a forum thread (admin override)."""
    thread = db.query(ForumThread).filter(ForumThread.id == thread_id).first()
    if not thread:
        raise HTTPException(status_code=404, detail="Thread not found")

    db.delete(thread)
    db.commit()

    logger.info("Thread deleted by admin", admin_id=str(current_admin.id), thread_id=str(thread_id))
    return {"message": "Thread deleted successfully"}


@router.delete("/replies/{reply_id}")
async def delete_reply_admin(
    reply_id: UUID,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Delete a forum reply (admin override)."""
    reply = db.query(ForumReply).filter(ForumReply.id == reply_id).first()
    if not reply:
        raise HTTPException(status_code=404, detail="Reply not found")

    db.delete(reply)
    db.commit()

    logger.info("Reply deleted by admin", admin_id=str(current_admin.id), reply_id=str(reply_id))
    return {"message": "Reply deleted successfully"}


# ============== Category Management ==============

@router.post("/categories")
async def create_category_admin(
    category: CategoryCreate = Body(...),
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Create a new forum category (admin only)."""
    new_category = ForumCategory(
        name=category.name,
        description=category.description,
        display_order=category.display_order
    )
    db.add(new_category)
    db.commit()
    db.refresh(new_category)

    logger.info("Category created", admin_id=str(current_admin.id), category_name=category.name)
    return {"message": "Category created", "id": str(new_category.id)}


@router.delete("/categories/{category_id}")
async def delete_category_admin(
    category_id: UUID,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Delete a forum category (admin only)."""
    category = db.query(ForumCategory).filter(ForumCategory.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    # Check if category has threads
    thread_count = db.query(func.count(ForumThread.id)).filter(
        ForumThread.category_id == category_id
    ).scalar() or 0

    if thread_count > 0:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot delete category with {thread_count} threads. Delete threads first."
        )

    db.delete(category)
    db.commit()

    logger.info("Category deleted", admin_id=str(current_admin.id), category_id=str(category_id))
    return {"message": "Category deleted successfully"}
