# Production Deployment Guide

## Server Information
- **Domain**: aquariangnosis.org
- **IP**: 195.246.231.84
- **Hosting**: CloudPanel
- **SSL**: Let's Encrypt (auto-managed)
- **Database**: MySQL 8.0.36-28
- **Python Version**: 3.11
- **App Port**: 8090
- **Backup**: Daily automated backups

## Pre-Deployment Setup

### 1. Database Configuration
Since the production server uses MySQL instead of PostgreSQL, we need to:

1. Update database dependencies in `server/requirements.txt`:
   ```txt
   # Replace psycopg2-binary with MySQL connector
   # psycopg2-binary==2.9.10  # Remove this line
   pymysql==1.1.0  # Add MySQL connector
   ```

2. Update database URL in production environment:
   ```bash
   # Instead of PostgreSQL:
   # DATABASE_URL=postgresql://user:password@localhost/aquarian_gnosis

   # Use MySQL:
   DATABASE_URL=mysql+pymysql://username:password@localhost/database_name
   ```

### 2. Application Configuration for Production

#### Environment Variables (.env file on server)
```bash
# Database
DATABASE_URL=mysql+pymysql://username:password@localhost/database_name

# Redis (if available on server)
REDIS_URL=redis://localhost:6379

# Security
SECRET_KEY=your-production-secret-key-here
ALLOWED_HOSTS=https://aquariangnosis.org

# Application
API_V1_STR=/api/v1
ACCESS_TOKEN_EXPIRE_MINUTES=10080

# Server configuration
PORT=8090
HOST=0.0.0.0
```

#### Production Requirements Updates
```txt
fastapi==0.115.0
uvicorn[standard]==0.32.0
sqlalchemy==2.0.36
alembic==1.14.0
pymysql==1.1.0
cryptography>=3.0.0  # Required for MySQL SSL connections
pydantic==2.10.1
pydantic-settings==2.6.1
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.12
email-validator==2.2.0
python-dotenv==1.0.1
redis==5.2.0
aioredis==2.0.1
apscheduler==3.10.4
structlog==24.4.0
colorama==0.4.6
```

### 3. Deployment Scripts

#### Start Script (server/start_production.sh)
```bash
#!/bin/bash
cd "$(dirname "$0")"

# Activate virtual environment
source venv/bin/activate

# Run database migrations
alembic upgrade head

# Start the application
uvicorn app.main:app --host 0.0.0.0 --port 8090 --workers 2
```

#### PM2 Production Configuration (ecosystem.production.js)
```javascript
module.exports = {
  apps: [
    {
      name: 'aquarian-gnosis-backend',
      script: './server/start_production.sh',
      cwd: '/path/to/aquarian-gnosis',
      env: {
        NODE_ENV: 'production',
        PORT: 8090,
        DATABASE_URL: 'mysql+pymysql://username:password@localhost/database_name',
        REDIS_URL: 'redis://localhost:6379',
        SECRET_KEY: 'your-production-secret-key',
        ALLOWED_HOSTS: 'https://aquariangnosis.org'
      },
      instances: 2,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: './logs/backend-error.log',
      out_file: './logs/backend-out.log',
      log_file: './logs/backend-combined.log',
      time: true
    }
  ]
};
```

## Deployment Steps

### 1. SSH Access
First, determine the correct SSH username. Try these common options:
```bash
# Try root user
ssh root@195.246.231.84

# Try domain-based user
ssh aquariangnosis@195.246.231.84

# Check CloudPanel documentation for SSH username
```

### 2. Server Setup
Once SSH access is established:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install required system packages
sudo apt install -y python3 python3-pip python3-venv git nginx redis-server mysql-client

# Clone repository
git clone https://github.com/yourusername/AquarianGnosis.git
cd AquarianGnosis

# Set up Python virtual environment
cd server
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
nano .env  # Configure production settings
```

### 3. Database Setup
```bash
# Connect to MySQL database (credentials from CloudPanel)
mysql -u username -p database_name

# Run database migrations
cd server
source venv/bin/activate
alembic upgrade head
```

### 4. Frontend Build
```bash
cd client
npm install
npm run build

# Copy build files to nginx directory or configure nginx to serve from dist/
```

### 5. Process Management
```bash
# Install PM2 globally
npm install -g pm2

# Start application
pm2 start ecosystem.production.js

# Set up PM2 to start on boot
pm2 startup
pm2 save
```

### 6. Nginx Configuration
CloudPanel should handle this, but the configuration should point to:
- Frontend: Static files from `client/dist/`
- Backend: Reverse proxy to `http://localhost:8090`

## Post-Deployment Checklist

- [ ] Database connection working
- [ ] Redis connection working (if available)
- [ ] SSL certificate active
- [ ] PM2 processes running
- [ ] Logs being written correctly
- [ ] Health endpoint responding: https://aquariangnosis.org/health
- [ ] Frontend loading correctly
- [ ] API endpoints responding

## Monitoring

### Health Checks
- Backend health: `https://aquariangnosis.org/health`
- Scheduler status: `https://aquariangnosis.org/admin/scheduler/status`

### Log Locations
- PM2 logs: `~/.pm2/logs/`
- Application logs: `./logs/`
- Nginx logs: `/var/log/nginx/`

### Commands for Monitoring
```bash
# Check PM2 processes
pm2 list
pm2 logs

# Check application logs
tail -f logs/backend-combined.log

# Check system resources
htop
df -h
```

## Troubleshooting

### Common Issues
1. **Port 8090 already in use**: Check with `lsof -i :8090` and kill conflicting processes
2. **Database connection failed**: Verify MySQL credentials and database exists
3. **Permission denied**: Check file permissions and user ownership
4. **Memory issues**: Monitor with `htop` and adjust PM2 memory limits

### Rollback Plan
```bash
# Stop current deployment
pm2 stop ecosystem.production.js

# Restore from previous backup
# (CloudPanel provides daily backups)

# Restart previous version
pm2 start previous-ecosystem.js
```