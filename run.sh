#!/bin/bash

# Aquarian Gnosis - Production/PM2 Runtime Script
# This script starts both frontend and backend servers for production use

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Cleanup function to stop PM2 processes
cleanup() {
    print_status "Shutting down Aquarian Gnosis..."
    pm2 stop ecosystem.config.js 2>/dev/null || true
    print_status "PM2 processes stopped"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Check if we're in the right directory
if [[ ! -f "package.json" ]] || [[ ! -d "server" ]] || [[ ! -d "client" ]]; then
    print_error "Please run this script from the AquarianGnosis root directory"
    exit 1
fi

print_success "🌟 Starting Aquarian Gnosis Platform..."
echo "═══════════════════════════════════════════════"

# Check if PostgreSQL is running
print_status "Checking database connection..."
cd server

# Activate virtual environment if it exists
if [[ -d "venv" ]]; then
    source venv/bin/activate
fi

if python -c "
from app.core.database import engine
try:
    with engine.connect() as conn:
        print('Database connection successful')
except Exception as e:
    print(f'Database connection failed: {e}')
    exit(1)
"; then
    print_success "✓ Database connection verified"
else
    print_error "✗ Database connection failed"
    print_warning "Make sure PostgreSQL is running and the database exists"
    print_warning "Run ./setup.sh if you haven't set up the database yet"
    exit 1
fi
cd ..

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    print_error "PM2 is not installed. Please install it with: npm install -g pm2"
    exit 1
fi

# Check for existing PM2 processes
print_status "Checking for existing PM2 processes..."
EXISTING_PROCESSES=$(pm2 list | grep -E "(aquarian-gnosis-backend|aquarian-gnosis-frontend)" | grep -E "(online|stopped)" || echo "")

if [[ -n "$EXISTING_PROCESSES" ]]; then
    print_warning "Found existing PM2 processes. Restarting them..."
    pm2 restart ecosystem.config.js --update-env
else
    print_status "No existing processes found. Starting new PM2 processes..."
    pm2 start ecosystem.config.js
fi

# Wait for services to be ready
print_status "Waiting for services to launch..."
sleep 3

# Wait for backend to be ready
print_status "Waiting for backend to launch on port 8000..."
for i in {1..20}; do # 20 attempts, 0.5s each = 10 seconds max wait
    if nc -z localhost 8000; then
        print_success "✓ Backend is up!"
        break
    fi
    sleep 0.5
done

# Final check
if ! nc -z localhost 8000; then
    print_error "✗ Backend server failed to start on port 8000."
    print_error "Check PM2 logs with: pm2 logs aquarian-gnosis-backend"
    exit 1
fi

# Wait for frontend to be ready
print_status "Waiting for frontend to launch on port 3000..."
for i in {1..20}; do # 20 attempts, 0.5s each = 10 seconds max wait
    if nc -z localhost 3000; then
        print_success "✓ Frontend is up!"
        break
    fi
    sleep 0.5
done

# Final check
if ! nc -z localhost 3000; then
    print_error "✗ Frontend server failed to start on port 3000."
    print_error "Check PM2 logs with: pm2 logs aquarian-gnosis-frontend"
    exit 1
fi

print_success "✓ Both services started successfully via PM2"
print_status "  API available at: http://localhost:8000"
print_status "  API docs at: http://localhost:8000/docs"
print_status "  App available at: http://localhost:3000"

echo ""
print_success "🎉 Aquarian Gnosis is now running!"
echo "═══════════════════════════════════════════════"
echo ""
echo "📱 Frontend:  http://localhost:3000"
echo "🔧 Backend:   http://localhost:8000" 
echo "📚 API Docs:  http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""
print_status "PM2 processes are running in the background"
print_status "Use 'pm2 list' to check status, 'pm2 logs' to view logs"
print_status "Use 'pm2 stop ecosystem.config.js' to stop all services"
echo ""

# Keep the script running to handle Ctrl+C
while true; do
    sleep 1
done