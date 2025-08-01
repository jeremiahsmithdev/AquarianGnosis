# Aquarian Gnosis - Development Setup

This guide will help you set up the development environment for the Aquarian Gnosis platform.

## Prerequisites

- **Node.js** (v18 or higher)
- **Python** (v3.9 or higher)
- **PostgreSQL** (v12 or higher)
- **Redis** (v6 or higher)

## Project Structure

```
AquarianGnosis/
├── client/                 # React TypeScript frontend
├── server/                 # FastAPI Python backend
├── PROJECT_PLAN.md        # Comprehensive project specification
├── IMPLEMENTATION_PLAN.md # Phase-by-phase implementation plan
└── DEVELOPMENT_SETUP.md   # This file
```

## Backend Setup

### 1. Install Python Dependencies

```bash
cd server
pip install -r requirements.txt
```

### 2. Database Setup

1. Create a PostgreSQL database:
```sql
CREATE DATABASE aquarian_gnosis;
CREATE USER postgres WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE aquarian_gnosis TO postgres;
```

2. Copy environment configuration:
```bash
cp .env.example .env
```

3. Update `.env` with your database credentials:
```env
DATABASE_URL=postgresql://postgres:password@localhost/aquarian_gnosis
SECRET_KEY=your-super-secret-key-change-in-production
```

### 3. Initialize Database

```bash
# Quick setup - create database tables directly
python init_db.py

# OR use Alembic for production (optional)
# alembic revision --autogenerate -m "Initial migration"
# alembic upgrade head
```

### 4. Start the Backend Server

```bash
# Recommended: Use PM2 for process management
npm run dev:backend

# Start all services with PM2
npm run dev

# Manual startup (not recommended - use PM2 instead)
# python run.py
```

The API will be available at: `http://localhost:8000`
API documentation: `http://localhost:8000/docs`

## Frontend Setup

### 1. Install Dependencies

```bash
cd client
npm install
```

### 2. Start the Development Server

```bash
# Recommended: Use PM2 for process management
npm run dev:frontend

# Start all services with PM2
npm run dev
```

The frontend will be available at: `http://localhost:3000`

## Development Workflow

### Phase 1 MVP Components

Currently implemented:
- ✅ **Authentication System**: User registration and login
- ✅ **Landing Page**: Gnostic cross navigation with banyan tree background
- ✅ **Basic Frontend Structure**: React + TypeScript + Zustand
- ✅ **API Backend**: FastAPI with PostgreSQL and JWT authentication
- ✅ **Database Schema**: User, UserLocation, and Message models

### Next Steps (Phase 1 Completion)

1. **Interactive Map Implementation**
   - Integrate Leaflet.js with OpenStreetMap
   - User location markers and privacy controls
   - Distance-based user discovery

2. **Location Management**
   - User location addition/editing interface
   - Geographic privacy settings
   - Location status (permanent, traveling, nomadic)

3. **Basic Messaging**
   - Platform-only messaging system
   - Conversation management
   - Real-time notifications

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/me` - Get current user

### User Management
- `GET /api/v1/users/profile` - Get user profile
- `PUT /api/v1/users/profile` - Update user profile
- `POST /api/v1/users/location` - Add/update user location
- `GET /api/v1/users/location` - Get user location
- `DELETE /api/v1/users/location` - Delete user location

### Map & Discovery
- `GET /api/v1/map/locations` - Get nearby locations (authenticated)
- `GET /api/v1/map/locations/public` - Get public locations
- `GET /api/v1/map/stats` - Get map statistics

### Messaging
- `POST /api/v1/messages/` - Send message
- `GET /api/v1/messages/` - Get messages/conversations
- `GET /api/v1/messages/conversations` - Get conversation list
- `PUT /api/v1/messages/{id}/read` - Mark message as read

## Testing

### Backend Testing
```bash
cd server
pytest
```

### Frontend Testing
```bash
cd client
npm test
```

## Docker Setup (Optional)

For containerized development:

```bash
# Build and run with Docker Compose
docker-compose up --build

# Run migrations in container
docker-compose exec backend alembic upgrade head
```

## Production Deployment

The application is designed to run on Oracle Cloud ARM instances. See deployment documentation for production setup instructions.

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure PostgreSQL is running
   - Check database credentials in `.env`
   - Verify database exists

2. **CORS Issues**
   - Check `ALLOWED_HOSTS` in backend configuration
   - Ensure frontend is running on expected port

3. **Authentication Problems**
   - Verify `SECRET_KEY` is set in environment
   - Check JWT token expiration settings

### Getting Help

- Check the implementation plan for feature specifications
- Review API documentation at `/docs` endpoint
- Consult project plan for architecture details

## Contributing

This project follows a modular architecture designed for long-term expansion. Each component is separated into distinct files and modules to facilitate future development phases.

### Code Style
- **Backend**: Follow PEP 8 Python style guidelines
- **Frontend**: Use TypeScript strict mode and consistent component patterns
- **API**: RESTful design with comprehensive error handling

### Development Phases
See `IMPLEMENTATION_PLAN.md` for detailed phase-by-phase development roadmap.

## 🚀 Quick Start for Testing

### Automated Setup (Recommended)
```bash
git clone <repository-url>
cd AquarianGnosis
./setup.sh  # Installs everything and sets up database
```

### Start the Application
```bash
# Option 1: PM2 (recommended for testing)
npm run pm2:start

# Option 2: Direct script
./run.sh

# Option 3: Development mode  
npm run dev
```

### Access Points
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

### For Complete Testing Guide
See `TESTING_GUIDE.md` for comprehensive testing instructions and troubleshooting.