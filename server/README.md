# Aquarian Gnosis Backend

Backend API for the Aquarian Gnosis community platform built with FastAPI and PostgreSQL.

## Features Implemented

### Core Features
- User authentication with JWT tokens
- Location management for community map
- Messaging system between users
- Database models for users and locations

### Phase 2 Community Features
- **Forum System**: Categories, threads, and replies with voting
- **Study Groups**: Group creation and membership management
- **Resource Sharing**: Community-driven content sharing system
- **Enhanced Security**: Role-based access control for community features

## API Endpoints

### Authentication
- POST /api/v1/auth/register
- POST /api/v1/auth/login
- POST /api/v1/auth/verify-email
- GET /api/v1/auth/me

### Users
- GET /api/v1/users/
- GET /api/v1/users/{user_id}
- PUT /api/v1/users/{user_id}
- DELETE /api/v1/users/{user_id}

### Map
- GET /api/v1/map/users
- POST /api/v1/map/location
- PUT /api/v1/map/location/{location_id}
- DELETE /api/v1/map/location/{location_id}

### Messages
- GET /api/v1/messages/
- GET /api/v1/messages/{message_id}
- POST /api/v1/messages/
- PUT /api/v1/messages/{message_id}
- DELETE /api/v1/messages/{message_id}

### Forum (New in Phase 2)
- GET /api/v1/forum/categories
- POST /api/v1/forum/categories
- PUT /api/v1/forum/categories/{category_id}
- DELETE /api/v1/forum/categories/{category_id}
- GET /api/v1/forum/categories/{category_id}/threads
- POST /api/v1/forum/threads
- GET /api/v1/forum/threads/{thread_id}
- PUT /api/v1/forum/threads/{thread_id}
- DELETE /api/v1/forum/threads/{thread_id}
- GET /api/v1/forum/threads/{thread_id}/replies
- POST /api/v1/forum/replies
- PUT /api/v1/forum/replies/{reply_id}
- DELETE /api/v1/forum/replies/{reply_id}
- POST /api/v1/forum/threads/{thread_id}/vote
- POST /api/v1/forum/replies/{reply_id}/vote

### Study Groups (New in Phase 2)
- GET /api/v1/study-groups
- POST /api/v1/study-groups
- GET /api/v1/study-groups/{group_id}
- PUT /api/v1/study-groups/{group_id}
- DELETE /api/v1/study-groups/{group_id}
- GET /api/v1/study-groups/{group_id}/members
- POST /api/v1/study-groups/{group_id}/join
- PUT /api/v1/study-groups/{group_id}/members/{member_id}
- DELETE /api/v1/study-groups/{group_id}/members/{member_id}

### Resources (New in Phase 2)
- GET /api/v1/resources
- POST /api/v1/resources
- GET /api/v1/resources/{resource_id}
- PUT /api/v1/resources/{resource_id}
- DELETE /api/v1/resources/{resource_id}
- POST /api/v1/resources/{resource_id}/vote

## Development Setup

1. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Set up environment variables in `.env` file:
   ```
   DATABASE_URL=postgresql://postgres:password@localhost/aquarian_gnosis
   SECRET_KEY=your-super-secret-key
   ALLOWED_HOSTS=http://localhost:3000,http://localhost:5173
   ```

3. Run database migrations:
   ```bash
   alembic upgrade head
   ```

4. Start development server:
   ```bash
   python run.py
   ```

## Testing

Run backend tests with:
```bash
pytest
```

## Dependencies

- FastAPI for API framework
- SQLAlchemy for ORM
- Alembic for database migrations
- PostgreSQL for database
- Pydantic for data validation
- python-jose for JWT handling
