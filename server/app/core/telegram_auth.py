"""Telegram Login Widget authentication validation.

Implements HMAC-SHA-256 hash verification as required by Telegram Login Widget.
Reference: https://core.telegram.org/widgets/login#checking-authorization
"""
import hashlib
import hmac
from datetime import datetime
from typing import Optional

from pydantic import BaseModel

from app.core.config import settings


class TelegramAuthData(BaseModel):
    """Data received from Telegram Login Widget."""

    id: int  # Telegram user ID
    first_name: str  # User's first name
    last_name: Optional[str] = None  # User's last name (optional)
    username: Optional[str] = None  # @username (optional)
    photo_url: Optional[str] = None  # Avatar URL (optional)
    auth_date: int  # Unix timestamp of authentication
    hash: str  # HMAC-SHA-256 hash for validation


def verify_telegram_auth(auth_data: TelegramAuthData, max_age_seconds: int = 86400) -> bool:
    """Verify Telegram Login Widget authentication data.

    Uses HMAC-SHA-256 with SHA256(bot_token) as the key.
    Returns True if hash is valid and auth_date is recent (within max_age_seconds).

    Args:
        auth_data: Authentication data from Telegram widget
        max_age_seconds: Maximum age of auth_date in seconds (default 24 hours)

    Returns:
        True if authentication is valid, False otherwise
    """
    if not settings.TELEGRAM_BOT_TOKEN:
        return False

    # Check auth_date freshness (prevent replay attacks)
    auth_timestamp = datetime.fromtimestamp(auth_data.auth_date)
    age_seconds = (datetime.now() - auth_timestamp).total_seconds()
    if age_seconds > max_age_seconds or age_seconds < 0:
        return False

    # Build data-check-string (alphabetically sorted, excluding hash)
    check_dict = auth_data.model_dump(exclude={'hash'}, exclude_none=True)
    data_check_string = '\n'.join(
        f"{k}={v}" for k, v in sorted(check_dict.items())
    )

    # Create secret key: SHA256(bot_token)
    secret_key = hashlib.sha256(
        settings.TELEGRAM_BOT_TOKEN.encode()
    ).digest()

    # Calculate expected hash
    expected_hash = hmac.new(
        secret_key,
        data_check_string.encode(),
        hashlib.sha256
    ).hexdigest()

    # Constant-time comparison to prevent timing attacks
    return hmac.compare_digest(expected_hash, auth_data.hash)
