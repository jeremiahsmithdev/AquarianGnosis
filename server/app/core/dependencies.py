"""Core dependencies for API authentication and authorization.

Provides reusable FastAPI dependencies for:
- Admin-only endpoint protection
- Optional user authentication
"""
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import Optional

from app.core.database import get_db
from app.core.security import verify_token
from app.models.user import User
from app.api.auth import get_current_user


async def get_current_admin(
    current_user: User = Depends(get_current_user)
) -> User:
    """Require authenticated user with admin privileges.

    Raises 403 if user is not an admin.
    """
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required"
        )
    return current_user


async def get_optional_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(
        HTTPBearer(auto_error=False)
    ),
    db: Session = Depends(get_db)
) -> Optional[User]:
    """Get current user if authenticated, None otherwise.

    Useful for endpoints that work differently for authenticated vs anonymous users.
    """
    if credentials is None:
        return None

    username = verify_token(credentials.credentials)
    if username is None:
        return None

    return db.query(User).filter(User.username == username).first()
