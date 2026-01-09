"""Telegram authentication API routes.

Handles:
- Registration/login via Telegram
- Linking existing account to Telegram
- Unlinking Telegram from account
- Importing profile data from Telegram
"""
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.auth import get_current_user
from app.core.config import settings
from app.core.database import get_db
from app.core.security import create_access_token
from app.core.telegram_auth import TelegramAuthData, verify_telegram_auth
from app.models.user import User
from app.schemas.user import (
    ProfileImportOptions,
    TelegramAuthRequest,
    TelegramLinkRequest,
    Token,
    User as UserSchema,
)

telegram_router = APIRouter()


@telegram_router.post("/auth", response_model=Token)
async def telegram_auth(
    auth_data: TelegramAuthRequest,
    db: Session = Depends(get_db)
):
    """Authenticate or register via Telegram.

    - If telegram_id exists: login existing user
    - If telegram_id is new: create new account
    """
    # Check if Telegram bot is configured
    if not settings.TELEGRAM_BOT_TOKEN:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Telegram authentication is not configured"
        )

    # Validate Telegram hash
    telegram_data = TelegramAuthData(**auth_data.model_dump())
    if not verify_telegram_auth(telegram_data):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Telegram authentication"
        )

    # Check if user exists with this Telegram ID
    user = db.query(User).filter(User.telegram_id == auth_data.id).first()

    if user:
        # Existing user - login
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Account is deactivated"
            )
    else:
        # New user - register
        # Generate unique username from Telegram data
        base_username = auth_data.username or f"user_{auth_data.id}"
        username = base_username
        counter = 1
        while db.query(User).filter(User.username == username).first():
            username = f"{base_username}_{counter}"
            counter += 1

        user = User(
            username=username,
            telegram_id=auth_data.id,
            telegram_username=auth_data.username,
            telegram_first_name=auth_data.first_name,
            telegram_last_name=auth_data.last_name,
            telegram_photo_url=auth_data.photo_url,
            telegram_linked_at=datetime.utcnow(),
            auth_provider='telegram',
            is_verified=True  # Telegram accounts are pre-verified
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    # Generate JWT token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username},
        expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer"}


@telegram_router.post("/link", response_model=UserSchema)
async def link_telegram(
    link_data: TelegramLinkRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Link Telegram account to existing user account."""
    # Check if Telegram bot is configured
    if not settings.TELEGRAM_BOT_TOKEN:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Telegram authentication is not configured"
        )

    # Validate Telegram hash
    telegram_data = TelegramAuthData(**link_data.model_dump())
    if not verify_telegram_auth(telegram_data):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Telegram authentication"
        )

    # Check if Telegram ID is already linked to another account
    existing_link = db.query(User).filter(
        User.telegram_id == link_data.id,
        User.id != current_user.id
    ).first()
    if existing_link:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This Telegram account is already linked to another user"
        )

    # Check if user already has Telegram linked
    if current_user.telegram_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Your account already has a Telegram account linked"
        )

    # Link Telegram
    current_user.telegram_id = link_data.id
    current_user.telegram_username = link_data.username
    current_user.telegram_first_name = link_data.first_name
    current_user.telegram_last_name = link_data.last_name
    current_user.telegram_photo_url = link_data.photo_url
    current_user.telegram_linked_at = datetime.utcnow()
    current_user.auth_provider = 'both' if current_user.password_hash else 'telegram'

    db.commit()
    db.refresh(current_user)

    return current_user


@telegram_router.post("/unlink", response_model=UserSchema)
async def unlink_telegram(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Unlink Telegram from account.

    User must have email/password auth set up before unlinking Telegram.
    """
    if not current_user.telegram_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No Telegram account linked"
        )

    # If user only has Telegram auth, they must set up password first
    if not current_user.password_hash or not current_user.email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot unlink Telegram - please set up email and password first"
        )

    # Clear Telegram data
    current_user.telegram_id = None
    current_user.telegram_username = None
    current_user.telegram_first_name = None
    current_user.telegram_last_name = None
    current_user.telegram_photo_url = None
    current_user.telegram_linked_at = None
    current_user.auth_provider = 'local'

    db.commit()
    db.refresh(current_user)

    return current_user


@telegram_router.post("/import-profile", response_model=UserSchema)
async def import_telegram_profile(
    import_options: ProfileImportOptions,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Import profile data from linked Telegram account."""
    if not current_user.telegram_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No Telegram account linked"
        )

    if import_options.import_username and current_user.telegram_username:
        # Check username availability
        new_username = current_user.telegram_username
        existing = db.query(User).filter(
            User.username == new_username,
            User.id != current_user.id
        ).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Username '{new_username}' is already taken"
            )
        current_user.username = new_username

    # Note: Avatar URL is already stored in telegram_photo_url
    # Frontend can use this directly or implement avatar storage

    db.commit()
    db.refresh(current_user)

    return current_user
