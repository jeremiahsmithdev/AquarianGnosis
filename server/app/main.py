import time
import uuid
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
from app.core.config import settings
from app.core.logging import configure_logging, get_logger, set_correlation_id
from app.core.redis import redis_manager
from app.core.scheduler import task_scheduler
from app.api.auth import auth_router
from app.api.telegram_auth import telegram_router
from app.api.users import users_router
from app.api.map import map_router
from app.api.messages import messages_router
from app.api.forum import router as forum_router
from app.api.study_group import router as study_group_router
from app.api.resource import router as resource_router
from app.api.about import router as about_router
from app.api.admin import router as admin_router

# Configure logging
configure_logging(log_level="INFO", json_logs=False)
logger = get_logger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Connect to Redis and start scheduler
    try:
        await redis_manager.connect()
        logger.info("Redis connection established")

        await task_scheduler.start()
        logger.info("Background task scheduler started")

        logger.info("Application startup completed")
    except Exception as e:
        logger.error("Failed to initialize application services", error=str(e))

    yield

    # Shutdown: Stop scheduler and disconnect from Redis
    try:
        await task_scheduler.stop()
        logger.info("Background task scheduler stopped")

        await redis_manager.disconnect()
        logger.info("Redis connection closed")

        logger.info("Application shutdown completed")
    except Exception as e:
        logger.error("Error during application shutdown", error=str(e))

app = FastAPI(
    title="Aquarian Gnosis API",
    description="Backend API for the Aquarian Gnosis community platform",
    version="1.0.0",
    lifespan=lifespan
)

# Add GZip compression middleware
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Logging and request tracking middleware
@app.middleware("http")
async def logging_middleware(request: Request, call_next):
    # Set correlation ID for request tracking
    correlation_id = set_correlation_id()

    # Log request
    start_time = time.time()
    logger.info(
        "Request started",
        method=request.method,
        url=str(request.url),
        client_host=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent"),
        correlation_id=correlation_id
    )

    # Process request
    response = await call_next(request)

    # Calculate response time
    process_time = time.time() - start_time

    # Add caching headers for static content and API responses
    if request.url.path.startswith("/api/v1"):
        # Cache API responses for 5 minutes
        response.headers["Cache-Control"] = "public, max-age=300"
        response.headers["ETag"] = f'"{correlation_id}"'

    # Add correlation ID to response headers
    response.headers["X-Correlation-ID"] = correlation_id

    # Log response
    logger.info(
        "Request completed",
        method=request.method,
        url=str(request.url),
        status_code=response.status_code,
        process_time=round(process_time, 4),
        correlation_id=correlation_id
    )

    return response

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.get_allowed_hosts_list(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(auth_router, prefix="/api/v1/auth", tags=["authentication"])
app.include_router(telegram_router, prefix="/api/v1/telegram", tags=["telegram-auth"])
app.include_router(users_router, prefix="/api/v1/users", tags=["users"])
app.include_router(map_router, prefix="/api/v1/map", tags=["map"])
app.include_router(messages_router, prefix="/api/v1/messages", tags=["messages"])
app.include_router(forum_router, prefix="/api/v1/forum", tags=["forum"])
app.include_router(study_group_router, prefix="/api/v1", tags=["study-groups"])
app.include_router(resource_router, prefix="/api/v1", tags=["resources"])
app.include_router(about_router, prefix="/api/v1/about", tags=["about"])
app.include_router(admin_router, prefix="/api/v1/admin", tags=["admin"])

@app.get("/")
async def root():
    return {"message": "Welcome to Aquarian Gnosis API"}

@app.get("/health")
async def health_check():
    health_status = {
        "status": "healthy",
        "services": {
            "api": "healthy",
            "redis": "healthy" if redis_manager.is_connected else "unhealthy",
            "scheduler": "healthy" if task_scheduler.is_running else "unhealthy"
        }
    }

    # Test Redis connection
    if redis_manager.is_connected:
        try:
            await redis_manager.redis_client.ping()
        except Exception as e:
            health_status["services"]["redis"] = "unhealthy"
            health_status["status"] = "degraded"
            logger.warning("Redis health check failed", error=str(e))

    # Check scheduler status
    if not task_scheduler.is_running:
        health_status["status"] = "degraded"

    return health_status

@app.get("/admin/scheduler/status")
async def scheduler_status():
    """Get detailed scheduler status (admin endpoint)"""
    return task_scheduler.get_task_info()