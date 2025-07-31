from typing import List
from pydantic_settings import BaseSettings
from pydantic import field_validator
import os

class Settings(BaseSettings):
    # API Configuration
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days
    
    # Database Configuration
    DATABASE_URL: str = "postgresql://postgres:password@localhost/aquarian_gnosis"
    
    # Redis Configuration
    REDIS_URL: str = "redis://localhost:6379"
    
    # CORS Configuration
    ALLOWED_HOSTS: str = "http://localhost:3000,http://localhost:5173"
    
    # Email Configuration (for future use)
    SMTP_TLS: bool = True
    SMTP_PORT: int = 587
    SMTP_HOST: str = ""
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    EMAILS_FROM_EMAIL: str = ""
    EMAILS_FROM_NAME: str = "Aquarian Gnosis"
    
    # Security
    ALGORITHM: str = "HS256"
    
    # File Upload
    MAX_UPLOAD_SIZE: int = 10 * 1024 * 1024  # 10MB
    UPLOAD_DIR: str = "uploads"
    
    model_config = {
        "env_file": ".env",
        "case_sensitive": True
    }

    def get_allowed_hosts_list(self) -> List[str]:
        """Convert ALLOWED_HOSTS string to list"""
        return [host.strip() for host in self.ALLOWED_HOSTS.split(",")]

settings = Settings()