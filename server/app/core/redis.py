import redis.asyncio as redis
from typing import Optional
import json
from datetime import timedelta
import structlog

from .config import settings

logger = structlog.get_logger()

class RedisManager:
    def __init__(self):
        self.redis_client: Optional[redis.Redis] = None
        self.is_connected = False

    async def connect(self):
        """Initialize Redis connection pool"""
        try:
            self.redis_client = redis.from_url(
                settings.REDIS_URL,
                encoding="utf-8",
                decode_responses=True,
                max_connections=20,
                retry_on_timeout=True,
                socket_keepalive=True,
                socket_keepalive_options={},
                health_check_interval=30
            )

            # Test connection
            await self.redis_client.ping()
            self.is_connected = True
            logger.info("Redis connection established", redis_url=settings.REDIS_URL)

        except Exception as e:
            logger.error("Failed to connect to Redis", error=str(e))
            self.is_connected = False
            raise

    async def disconnect(self):
        """Close Redis connection"""
        if self.redis_client:
            await self.redis_client.close()
            self.is_connected = False
            logger.info("Redis connection closed")

    async def get(self, key: str) -> Optional[str]:
        """Get value by key"""
        if not self.is_connected:
            return None

        try:
            return await self.redis_client.get(key)
        except Exception as e:
            logger.error("Redis get operation failed", key=key, error=str(e))
            return None

    async def set(
        self,
        key: str,
        value: str,
        expire: Optional[timedelta] = None
    ) -> bool:
        """Set key-value pair with optional expiration"""
        if not self.is_connected:
            return False

        try:
            await self.redis_client.set(key, value, ex=expire)
            return True
        except Exception as e:
            logger.error("Redis set operation failed", key=key, error=str(e))
            return False

    async def delete(self, key: str) -> bool:
        """Delete key"""
        if not self.is_connected:
            return False

        try:
            result = await self.redis_client.delete(key)
            return result > 0
        except Exception as e:
            logger.error("Redis delete operation failed", key=key, error=str(e))
            return False

    async def exists(self, key: str) -> bool:
        """Check if key exists"""
        if not self.is_connected:
            return False

        try:
            return bool(await self.redis_client.exists(key))
        except Exception as e:
            logger.error("Redis exists operation failed", key=key, error=str(e))
            return False

    async def expire(self, key: str, expire: timedelta) -> bool:
        """Set expiration for existing key"""
        if not self.is_connected:
            return False

        try:
            return await self.redis_client.expire(key, expire)
        except Exception as e:
            logger.error("Redis expire operation failed", key=key, error=str(e))
            return False

    async def get_json(self, key: str) -> Optional[dict]:
        """Get JSON value by key"""
        try:
            value = await self.get(key)
            if value:
                return json.loads(value)
            return None
        except json.JSONDecodeError as e:
            logger.error("Redis JSON decode failed", key=key, error=str(e))
            return None

    async def set_json(
        self,
        key: str,
        value: dict,
        expire: Optional[timedelta] = None
    ) -> bool:
        """Set JSON value with optional expiration"""
        try:
            json_value = json.dumps(value, default=str)
            return await self.set(key, json_value, expire)
        except Exception as e:
            logger.error("Redis JSON set failed", key=key, error=str(e))
            return False

    async def increment(self, key: str, amount: int = 1) -> Optional[int]:
        """Increment counter"""
        if not self.is_connected:
            return None

        try:
            return await self.redis_client.incrby(key, amount)
        except Exception as e:
            logger.error("Redis increment failed", key=key, error=str(e))
            return None

    async def set_hash(self, key: str, mapping: dict) -> bool:
        """Set hash fields"""
        if not self.is_connected:
            return False

        try:
            await self.redis_client.hset(key, mapping=mapping)
            return True
        except Exception as e:
            logger.error("Redis hash set failed", key=key, error=str(e))
            return False

    async def get_hash(self, key: str) -> Optional[dict]:
        """Get all hash fields"""
        if not self.is_connected:
            return None

        try:
            return await self.redis_client.hgetall(key)
        except Exception as e:
            logger.error("Redis hash get failed", key=key, error=str(e))
            return None

    async def get_hash_field(self, key: str, field: str) -> Optional[str]:
        """Get specific hash field"""
        if not self.is_connected:
            return None

        try:
            return await self.redis_client.hget(key, field)
        except Exception as e:
            logger.error("Redis hash field get failed", key=key, field=field, error=str(e))
            return None

    async def push_to_list(self, key: str, *values: str) -> Optional[int]:
        """Push values to list"""
        if not self.is_connected:
            return None

        try:
            return await self.redis_client.lpush(key, *values)
        except Exception as e:
            logger.error("Redis list push failed", key=key, error=str(e))
            return None

    async def pop_from_list(self, key: str) -> Optional[str]:
        """Pop value from list"""
        if not self.is_connected:
            return None

        try:
            return await self.redis_client.rpop(key)
        except Exception as e:
            logger.error("Redis list pop failed", key=key, error=str(e))
            return None

    async def get_list_length(self, key: str) -> Optional[int]:
        """Get list length"""
        if not self.is_connected:
            return None

        try:
            return await self.redis_client.llen(key)
        except Exception as e:
            logger.error("Redis list length failed", key=key, error=str(e))
            return None

# Global Redis manager instance
redis_manager = RedisManager()

# Cache decorator for functions
def cache_result(expire_minutes: int = 5):
    """Decorator to cache function results in Redis"""
    def decorator(func):
        async def wrapper(*args, **kwargs):
            # Generate cache key from function name and arguments
            cache_key = f"cache:{func.__name__}:{hash(str(args) + str(kwargs))}"

            # Try to get cached result
            cached_result = await redis_manager.get_json(cache_key)
            if cached_result is not None:
                logger.debug("Cache hit", function=func.__name__, cache_key=cache_key)
                return cached_result

            # Execute function and cache result
            result = await func(*args, **kwargs)
            if result is not None:
                await redis_manager.set_json(
                    cache_key,
                    result,
                    expire=timedelta(minutes=expire_minutes)
                )
                logger.debug("Cache miss - result cached", function=func.__name__, cache_key=cache_key)

            return result
        return wrapper
    return decorator

# Session management helpers
class SessionManager:
    def __init__(self, redis_manager: RedisManager):
        self.redis = redis_manager
        self.session_prefix = "session:"
        self.default_expire = timedelta(hours=24)

    async def create_session(self, session_id: str, user_data: dict) -> bool:
        """Create user session"""
        key = f"{self.session_prefix}{session_id}"
        return await self.redis.set_json(key, user_data, expire=self.default_expire)

    async def get_session(self, session_id: str) -> Optional[dict]:
        """Get user session data"""
        key = f"{self.session_prefix}{session_id}"
        return await self.redis.get_json(key)

    async def update_session(self, session_id: str, user_data: dict) -> bool:
        """Update user session"""
        key = f"{self.session_prefix}{session_id}"
        # Extend expiration on update
        await self.redis.expire(key, self.default_expire)
        return await self.redis.set_json(key, user_data, expire=self.default_expire)

    async def delete_session(self, session_id: str) -> bool:
        """Delete user session"""
        key = f"{self.session_prefix}{session_id}"
        return await self.redis.delete(key)

    async def extend_session(self, session_id: str) -> bool:
        """Extend session expiration"""
        key = f"{self.session_prefix}{session_id}"
        return await self.redis.expire(key, self.default_expire)

# Global session manager
session_manager = SessionManager(redis_manager)