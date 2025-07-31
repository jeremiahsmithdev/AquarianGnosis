# Aquarian Gnosis - Local Testing Guide

This guide will help you set up and test the Aquarian Gnosis platform locally.

## Prerequisites

Before starting, make sure you have the following installed:

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **Python 3.9+** - [Download here](https://python.org/)
- **PostgreSQL 12+** - [Download here](https://postgresql.org/download/)
- **PM2** (optional, for process management) - `npm install -g pm2`

## Quick Setup

### Option 1: Automated Setup (Recommended)

```bash
# Clone the repository (if not already done)
git clone <repository-url>
cd AquarianGnosis

# Run the automated setup script
./setup.sh
```

This script will:
- Install all frontend and backend dependencies
- Create the PostgreSQL database
- Initialize the database schema
- Verify the setup

### Option 2: Manual Setup

```bash
# Install dependencies
npm run install:all

# Create PostgreSQL database
createdb aquarian_gnosis

# Initialize database schema
cd server
python init_db.py
cd ..
```

## Running the Application

### Option 1: Using PM2 (Recommended for testing)

```bash
# Start with PM2
npm run pm2:start

# Check status
npm run pm2:status

# View logs
npm run pm2:logs

# Stop when done
npm run pm2:stop
```

### Option 2: Using the run script

```bash
# Start both servers
./run.sh
```

### Option 3: Development mode (separate terminals)

```bash
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend  
npm run dev:frontend
```

## Accessing the Application

Once running, you can access:

- **Frontend Application**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Interactive API**: http://localhost:8000/redoc

## Testing the Features

### 1. Test User Registration
1. Open http://localhost:5173
2. Click "Sign In" button
3. Click "Create Account"
4. Fill in registration form with:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `testpassword123`
5. Submit form - should show success message
6. Switch to login and sign in

### 2. Test Interactive Map
1. After logging in, click "Map" in navigation
2. Click "Find My Location" to get current position
3. Go to "My Location" tab
4. Click "Add My Location"
5. Choose location settings and save
6. Verify location appears on map

### 3. Test Messaging System
1. With location added, click "Messages" in navigation
2. Open browser dev tools and note your user ID
3. In a new incognito window, register another user
4. Add their location to the map
5. Click on their marker and select "Contact User"
6. Send a test message
7. Verify message appears in both accounts

### 4. Test Responsive Design
1. Open browser dev tools (F12)
2. Switch to mobile view
3. Test all features on different screen sizes
4. Verify touch interactions work properly

## Monitoring and Logs

### PM2 Monitoring
```bash
# Real-time monitoring
pm2 monit

# View logs
pm2 logs aquarian-gnosis-frontend
pm2 logs aquarian-gnosis-backend

# Restart if needed
npm run pm2:restart
```

### Direct Log Access
```bash
# View log files directly
tail -f logs/frontend-combined.log
tail -f logs/backend-combined.log
```

## Common Issues and Solutions

### Database Connection Error
```
Error: database "aquarian_gnosis" does not exist
```
**Solution**: Create the database manually:
```bash
createdb aquarian_gnosis
```

### Port Already in Use
```
Error: Port 8000 is already in use
```
**Solution**: Stop existing processes:
```bash
npm run pm2:stop
# or
lsof -ti:8000 | xargs kill
```

### Frontend Won't Start
```
Error: Cannot find module
```
**Solution**: Reinstall dependencies:
```bash
cd client
rm -rf node_modules package-lock.json
npm install
```

### Python Module Errors
```
ModuleNotFoundError: No module named 'fastapi'
```
**Solution**: Reinstall Python dependencies:
```bash
cd server
pip install -r requirements.txt
```

## Performance Testing

### Load Testing with Artillery
```bash
# Install artillery
npm install -g artillery

# Test API endpoints
artillery quick --count 10 --num 5 http://localhost:8000/health
```

### Browser Performance
1. Open Chrome DevTools
2. Go to "Lighthouse" tab
3. Run performance audit on main pages
4. Target: 90+ performance score

## Security Testing

### Basic Security Checks
1. Test authentication with invalid tokens
2. Try SQL injection in forms
3. Verify CORS headers
4. Test file upload limits
5. Check password hashing

### API Security
```bash
# Test without authentication
curl http://localhost:8000/api/v1/users/profile

# Should return 401 Unauthorized
```

## Database Testing

### Verify Schema
```bash
cd server
python -c "
from app.models.user import User, UserLocation, Message
from app.core.database import engine
print('Tables created successfully!')
print('User:', User.__tablename__)
print('UserLocation:', UserLocation.__tablename__) 
print('Message:', Message.__tablename__)
"
```

### Test Database Queries
```bash
# Connect to database
psql aquarian_gnosis

# Check tables
\dt

# Check user table
SELECT * FROM users LIMIT 5;
```

## Cleanup

### Stop All Services
```bash
# Stop PM2 processes
npm run pm2:delete

# Or stop the run script with Ctrl+C

# Clean up logs
rm -rf logs/*
```

### Reset Database
```bash
# Drop and recreate database
dropdb aquarian_gnosis
createdb aquarian_gnosis
cd server
python init_db.py
```

## Troubleshooting

### Full Reset
If everything breaks, start fresh:
```bash
# Stop all processes
npm run pm2:delete

# Clean dependencies
rm -rf client/node_modules client/package-lock.json
rm -rf node_modules package-lock.json

# Reset database
dropdb aquarian_gnosis
createdb aquarian_gnosis

# Run setup again
./setup.sh
```

### Get Help
- Check logs: `npm run pm2:logs`
- Verify database: `psql aquarian_gnosis`
- Test API: http://localhost:8000/docs
- Check network: `netstat -tulpn | grep :8000`

## Success Criteria

The application is working correctly when:

✅ Both frontend and backend start without errors  
✅ Database connection is successful  
✅ User registration and login work  
✅ Map displays and location sharing works  
✅ Messaging system functions properly  
✅ Mobile interface is responsive  
✅ No console errors in browser  
✅ API documentation is accessible  

## Next Steps

After successful testing:
1. Consider production deployment
2. Set up monitoring and alerts
3. Plan Phase 2 feature development
4. Gather user feedback
5. Performance optimization

---

*Happy testing! 🚀*