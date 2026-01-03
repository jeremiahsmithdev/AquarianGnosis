from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, func, cast, Float
from typing import List, Optional
from pydantic import BaseModel
from app.core.database import get_db
from app.api.auth import get_current_user
from app.models.user import User, UserLocation
from app.schemas.user import Location as LocationSchema, LocationWithUser
from decimal import Decimal
import math
import json

map_router = APIRouter()


class LocationCreate(BaseModel):
    latitude: float
    longitude: float
    is_public: bool = True
    status: str = "permanent"
    visibility_type: str = "public"  # public, members, custom
    allowed_users: Optional[List[str]] = None  # usernames for custom visibility


class LocationUpdate(BaseModel):
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    is_public: Optional[bool] = None
    status: Optional[str] = None
    visibility_type: Optional[str] = None
    allowed_users: Optional[List[str]] = None


@map_router.get("/location", response_model=LocationSchema)
async def get_user_location(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get the current user's location"""
    location = db.query(UserLocation).filter(
        UserLocation.user_id == current_user.id
    ).first()

    if not location:
        raise HTTPException(status_code=404, detail="Location not found")

    return location


@map_router.post("/location", response_model=LocationSchema)
async def create_user_location(
    location_data: LocationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create or update the current user's location"""
    existing_location = db.query(UserLocation).filter(
        UserLocation.user_id == current_user.id
    ).first()

    # Serialize allowed_users to JSON string
    allowed_users_json = json.dumps(location_data.allowed_users) if location_data.allowed_users else None

    if existing_location:
        existing_location.latitude = Decimal(str(location_data.latitude))
        existing_location.longitude = Decimal(str(location_data.longitude))
        existing_location.is_public = location_data.is_public
        existing_location.status = location_data.status
        existing_location.visibility_type = location_data.visibility_type
        existing_location.allowed_users = allowed_users_json
        db.commit()
        db.refresh(existing_location)
        return existing_location

    new_location = UserLocation(
        user_id=current_user.id,
        latitude=Decimal(str(location_data.latitude)),
        longitude=Decimal(str(location_data.longitude)),
        is_public=location_data.is_public,
        status=location_data.status,
        visibility_type=location_data.visibility_type,
        allowed_users=allowed_users_json
    )
    db.add(new_location)
    db.commit()
    db.refresh(new_location)
    return new_location


@map_router.put("/location", response_model=LocationSchema)
async def update_user_location(
    updates: LocationUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update the current user's location"""
    location = db.query(UserLocation).filter(
        UserLocation.user_id == current_user.id
    ).first()

    if not location:
        raise HTTPException(status_code=404, detail="Location not found")

    if updates.latitude is not None:
        location.latitude = Decimal(str(updates.latitude))
    if updates.longitude is not None:
        location.longitude = Decimal(str(updates.longitude))
    if updates.is_public is not None:
        location.is_public = updates.is_public
    if updates.status is not None:
        location.status = updates.status
    if updates.visibility_type is not None:
        location.visibility_type = updates.visibility_type
    if updates.allowed_users is not None:
        location.allowed_users = json.dumps(updates.allowed_users) if updates.allowed_users else None

    db.commit()
    db.refresh(location)
    return location


@map_router.delete("/location")
async def delete_user_location(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete the current user's location"""
    location = db.query(UserLocation).filter(
        UserLocation.user_id == current_user.id
    ).first()

    if not location:
        raise HTTPException(status_code=404, detail="Location not found")

    db.delete(location)
    db.commit()
    return {"message": "Location deleted successfully"}


@map_router.get("/locations", response_model=List[LocationWithUser])
async def get_nearby_locations(
    radius_km: Optional[float] = Query(50, description="Search radius in kilometers"),
    status: Optional[str] = Query(None, description="Filter by status (permanent, traveling, nomadic)"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get nearby user locations with usernames (requires authentication)"""
    # Get current user's location
    user_location = db.query(UserLocation).filter(
        UserLocation.user_id == current_user.id
    ).first()

    if not user_location:
        # If user has no location, return empty list
        return []

    # Convert to float for calculations
    user_lat = float(user_location.latitude)
    user_lng = float(user_location.longitude)

    # Build filter conditions (visibility checked in Python for custom access)
    filter_conditions = [
        UserLocation.user_id != current_user.id,  # Exclude current user
        # Simple bounding box filter for performance
        UserLocation.latitude.between(
            Decimal(user_lat - radius_km / 111.0),
            Decimal(user_lat + radius_km / 111.0)
        ),
        UserLocation.longitude.between(
            Decimal(user_lng - radius_km / (111.0 * math.cos(math.radians(user_lat)))),
            Decimal(user_lng + radius_km / (111.0 * math.cos(math.radians(user_lat))))
        )
    ]

    # Add status filter if provided
    if status and status != 'all':
        filter_conditions.append(UserLocation.status == status)

    # Query locations with usernames by joining User table
    results = db.query(UserLocation, User.username).join(
        User, UserLocation.user_id == User.id
    ).filter(and_(*filter_conditions)).all()

    # Filter by actual distance (Haversine formula), visibility, and build response
    nearby_locations = []
    for location, username in results:
        # Check visibility permissions
        if not check_visibility_permission(location, current_user.username):
            continue

        distance = calculate_distance(
            user_lat, user_lng,
            float(location.latitude), float(location.longitude)
        )
        if distance <= radius_km:
            # Create LocationWithUser response
            location_dict = {
                "id": location.id,
                "user_id": location.user_id,
                "latitude": location.latitude,
                "longitude": location.longitude,
                "is_public": location.is_public,
                "status": location.status,
                "created_at": location.created_at,
                "updated_at": location.updated_at,
                "username": username
            }
            nearby_locations.append(location_dict)

    return nearby_locations

@map_router.get("/locations/public", response_model=List[LocationWithUser])
async def get_public_locations(
    db: Session = Depends(get_db)
):
    """Get all public locations with usernames (no authentication required for browsing)"""
    # Only show locations that are explicitly public (visibility_type = 'public' and is_public = True)
    results = db.query(UserLocation, User.username).join(
        User, UserLocation.user_id == User.id
    ).filter(
        and_(
            UserLocation.is_public == True,
            or_(
                UserLocation.visibility_type == 'public',
                UserLocation.visibility_type == None  # Backwards compatibility for older entries
            )
        )
    ).all()

    # Build response with usernames
    locations = []
    for location, username in results:
        location_dict = {
            "id": location.id,
            "user_id": location.user_id,
            "latitude": location.latitude,
            "longitude": location.longitude,
            "is_public": location.is_public,
            "status": location.status,
            "created_at": location.created_at,
            "updated_at": location.updated_at,
            "username": username
        }
        locations.append(location_dict)

    return locations

@map_router.get("/stats")
async def get_map_stats(db: Session = Depends(get_db)):
    """Get basic map statistics"""
    total_users = db.query(User).count()
    users_with_locations = db.query(UserLocation).count()
    public_locations = db.query(UserLocation).filter(
        UserLocation.is_public == True
    ).count()
    
    return {
        "total_users": total_users,
        "users_with_locations": users_with_locations,
        "public_locations": public_locations,
        "location_sharing_rate": round(users_with_locations / max(total_users, 1) * 100, 2)
    }

def check_visibility_permission(location: UserLocation, viewer_username: str = None) -> bool:
    """
    Check if a location should be visible to the viewer based on visibility settings.

    - public: visible to everyone (including unauthenticated users)
    - members: visible to any authenticated user
    - custom: visible only to users in the allowed_users list
    """
    visibility_type = getattr(location, 'visibility_type', 'public') or 'public'

    # Public locations are visible to everyone
    if visibility_type == 'public':
        return location.is_public

    # Members visibility requires authentication
    if visibility_type == 'members':
        return viewer_username is not None

    # Custom visibility requires user to be in allowed_users list
    if visibility_type == 'custom':
        if not viewer_username:
            return False
        allowed_users_json = getattr(location, 'allowed_users', None)
        if not allowed_users_json:
            return False
        try:
            allowed_users = json.loads(allowed_users_json)
            return viewer_username in allowed_users
        except (json.JSONDecodeError, TypeError):
            return False

    # Default to is_public for backwards compatibility
    return location.is_public


def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculate the great circle distance between two points 
    on the earth (specified in decimal degrees) using Haversine formula
    Returns distance in kilometers
    """
    # Convert decimal degrees to radians
    lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])
    
    # Haversine formula
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
    c = 2 * math.asin(math.sqrt(a))
    
    # Radius of earth in kilometers
    r = 6371
    return c * r