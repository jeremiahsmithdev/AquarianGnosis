from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.api.auth import get_current_user
from app.models.user import User, UserLocation
from app.schemas.user import User as UserSchema, UserUpdate, LocationCreate, Location as LocationSchema, LocationUpdate

users_router = APIRouter()

@users_router.get("/profile", response_model=UserSchema)
async def get_profile(current_user: User = Depends(get_current_user)):
    """Get current user profile"""
    return current_user

@users_router.put("/profile", response_model=UserSchema)
async def update_profile(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update current user profile"""
    update_data = user_update.dict(exclude_unset=True)
    
    # Check if username is being updated and if it already exists
    if "username" in update_data:
        existing_user = db.query(User).filter(
            User.username == update_data["username"],
            User.id != current_user.id
        ).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already exists"
            )
    
    # Check if email is being updated and if it already exists
    if "email" in update_data:
        existing_email = db.query(User).filter(
            User.email == update_data["email"],
            User.id != current_user.id
        ).first()
        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
    
    # Update user
    for field, value in update_data.items():
        setattr(current_user, field, value)
    
    db.commit()
    db.refresh(current_user)
    return current_user

@users_router.post("/location", response_model=LocationSchema)
async def add_location(
    location_data: LocationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Add or update user location"""
    # Check if user already has a location
    existing_location = db.query(UserLocation).filter(
        UserLocation.user_id == current_user.id
    ).first()
    
    if existing_location:
        # Update existing location
        for field, value in location_data.dict().items():
            setattr(existing_location, field, value)
        db.commit()
        db.refresh(existing_location)
        return existing_location
    else:
        # Create new location
        db_location = UserLocation(
            user_id=current_user.id,
            **location_data.dict()
        )
        db.add(db_location)
        db.commit()
        db.refresh(db_location)
        return db_location

@users_router.get("/location", response_model=LocationSchema)
async def get_location(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user location"""
    location = db.query(UserLocation).filter(
        UserLocation.user_id == current_user.id
    ).first()
    
    if not location:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Location not found"
        )
    
    return location

@users_router.put("/location", response_model=LocationSchema)
async def update_location(
    location_update: LocationUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update user location"""
    location = db.query(UserLocation).filter(
        UserLocation.user_id == current_user.id
    ).first()
    
    if not location:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Location not found. Please add a location first."
        )
    
    update_data = location_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(location, field, value)
    
    db.commit()
    db.refresh(location)
    return location

@users_router.delete("/location")
async def delete_location(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete user location"""
    location = db.query(UserLocation).filter(
        UserLocation.user_id == current_user.id
    ).first()
    
    if not location:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Location not found"
        )
    
    db.delete(location)
    db.commit()
    return {"message": "Location deleted successfully"}