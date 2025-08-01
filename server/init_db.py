#!/usr/bin/env python3

# Add the current directory to Python path to ensure imports work
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

"""
Database initialization script for Aquarian Gnosis
Run this script to set up the database schema
"""

import os
import sys
from sqlalchemy import create_engine
from app.core.config import settings
from app.core.database import Base
from app.models.user import User, UserLocation, Message

def create_database():
    """Create database tables"""
    print("Creating database tables...")
    
    try:
        engine = create_engine(settings.DATABASE_URL)
        Base.metadata.create_all(bind=engine)
        print("✅ Database tables created successfully!")
        
        # Test connection
        with engine.connect() as conn:
            print("✅ Database connection successful!")
            
    except Exception as e:
        print(f"❌ Error creating database: {e}")
        print("\nMake sure PostgreSQL is running and the database exists.")
        print("You can create the database with:")
        print("CREATE DATABASE aquarian_gnosis;")
        return False
    
    return True

def main():
    """Main function"""
    print("🌟 Initializing Aquarian Gnosis Database")
    print("=" * 50)
    
    if create_database():
        print("\n🎉 Database initialization complete!")
        print("\nYou can now start the backend server with:")
        print("python run.py")
    else:
        print("\n💥 Database initialization failed!")
        sys.exit(1)

if __name__ == "__main__":
    main()