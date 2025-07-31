from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_, func, cast, Float
from typing import List, Optional
from app.core.database import get_db
from app.api.auth import get_current_user
from app.models.user import User, UserLocation
from app.schemas.user import Location as LocationSchema
from decimal import Decimal
import math

map_router = APIRouter()

@map_router.get("/locations", response_model=List[LocationSchema])
async def get_nearby_locations(
    radius_km: Optional[float] = Query(50, description="Search radius in kilometers"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get nearby user locations (requires authentication to see other users)"""
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
    
    # Calculate distance using Haversine formula in SQL
    # This is a simplified version - for production, consider using PostGIS
    locations = db.query(UserLocation).filter(
        and_(
            UserLocation.is_public == True,
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
        )
    ).all()
    
    # Filter by actual distance (Haversine formula)
    nearby_locations = []
    for location in locations:
        distance = calculate_distance(
            user_lat, user_lng,
            float(location.latitude), float(location.longitude)
        )
        if distance <= radius_km:
            nearby_locations.append(location)
    
    return nearby_locations

@map_router.get("/locations/public", response_model=List[LocationSchema])
async def get_public_locations(
    db: Session = Depends(get_db)
):
    """Get all public locations (no authentication required for browsing)"""
    locations = db.query(UserLocation).filter(
        UserLocation.is_public == True
    ).all()
    
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