# Aquarian Gnosis Development Setup Guide

## Overview
This guide provides instructions for setting up the development environment for the Aquarian Gnosis platform, including the newly implemented community features.

## Prerequisites

### System Requirements
- Node.js 18+
- Python 3.9+
- PostgreSQL 13+
- PM2 (process manager)

### Installation
1. Clone the repository
2. Run the setup script:
   ```bash
   ./setup.sh
   ```

## Environment Configuration

### Backend (.env file in server directory)
```
DATABASE_URL=postgresql://postgres:password@localhost/aquarian_gnosis
SECRET_KEY=your-super-secret-key-generate-new-one
REDIS_URL=redis://localhost:6379
ALLOWED_HOSTS=http://localhost:3000,http://localhost:5173
```

### Frontend (.env.local file in client directory)
```
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_APP_TITLE=Aquarian Gnosis
VITE_APP_DESCRIPTION=Gnostic Community Platform
```

## Running the Application

### Development Mode
Start both frontend and backend services:
```bash
npm run dev
```

Check service status:
```bash
npm run pm2:status
```

View logs:
```bash
npm run pm2:logs
```

### Production Mode
Build frontend:
```bash
npm run build
```

## New Community Features (Phase 2)

### Database Migrations
After setting up the database, run migrations for community features:
```bash
cd server
alembic upgrade head
```

This creates tables for:
- Forum categories, threads, and replies
- Study groups and memberships
- Shared resources

### API Endpoints
The new community features are accessible through these API endpoints:

#### Forum System
- `/api/v1/forum/categories` - Manage discussion categories
- `/api/v1/forum/threads` - Create and manage forum threads
- `/api/v1/forum/replies` - Add and manage thread replies
- `/api/v1/forum/*/vote` - Vote on threads and replies

#### Study Groups
- `/api/v1/study-groups` - Create and manage study groups
- `/api/v1/study-groups/*/join` - Join study groups
- `/api/v1/study-groups/*/members` - Manage group members

#### Resource Sharing
- `/api/v1/resources` - Share and manage community resources
- `/api/v1/resources/*/vote` - Vote on shared resources

### Frontend Components
The community features are implemented in these frontend components:
- `CommunityPage.tsx` - Main community interface with forum and study groups
- `ResourcesPage.tsx` - Resource sharing and browsing
- `OrganizationsPage.tsx` - Organization directory listings

## Testing

Run all tests:
```bash
npm test
```

Run backend tests:
```bash
npm run test:backend
```

Run frontend tests:
```bash
npm run test:frontend
```

## Troubleshooting

### Common Issues
1. **Database Connection**: Verify DATABASE_URL in .env file
2. **API Errors**: Check backend logs with `pm2 logs backend`
3. **Frontend Build**: Ensure all environment variables are set
4. **PM2 Processes**: Restart with `pm2 restart ecosystem.config.js --update-env`

### Useful Commands
- `pm2 list` - View running processes
- `pm2 monit` - Monitor process health
- `pm2 kill` - Stop all PM2 processes (emergency)
- `alembic current` - Check migration status
- `alembic branches` - View available migrations

## Next Steps

After completing the setup:
1. Run database migrations
2. Test the community features
3. Review the implementation plan for Phase 3
4. Check CLAUDE.md for ongoing technical debt items
