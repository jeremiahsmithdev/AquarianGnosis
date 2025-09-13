from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.core.config import settings
from app.api.auth import auth_router
from app.api.users import users_router
from app.api.map import map_router
from app.api.messages import messages_router
from app.api.forum import router as forum_router
from app.api.study_group import router as study_group_router
from app.api.resource import router as resource_router

app = FastAPI(
    title="Aquarian Gnosis API",
    description="Backend API for the Aquarian Gnosis community platform",
    version="1.0.0",
)

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
app.include_router(users_router, prefix="/api/v1/users", tags=["users"])
app.include_router(map_router, prefix="/api/v1/map", tags=["map"])
app.include_router(messages_router, prefix="/api/v1/messages", tags=["messages"])
app.include_router(forum_router, prefix="/api/v1/forum", tags=["forum"])
app.include_router(study_group_router, prefix="/api/v1", tags=["study-groups"])
app.include_router(resource_router, prefix="/api/v1", tags=["resources"])

@app.get("/")
async def root():
    return {"message": "Welcome to Aquarian Gnosis API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}