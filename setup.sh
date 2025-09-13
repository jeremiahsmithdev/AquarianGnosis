#!/bin/bash

# Aquarian Gnosis - Local Development Setup Script
# This script sets up everything needed to run the application locally

set -e  # Exit on any error

echo "🌟 Setting up Aquarian Gnosis for local development..."
echo "=" * 60

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

# Check if we're in the right directory
if [[ ! -f "package.json" ]] || [[ ! -d "server" ]] || [[ ! -d "client" ]]; then
    print_error "Please run this script from the AquarianGnosis root directory"
    exit 1
fi

print_status "Step 1: Installing frontend dependencies..."
cd client
if npm install; then
    print_success "Frontend dependencies installed"
else
    print_error "Failed to install frontend dependencies"
    exit 1
fi
cd ..

print_status "Step 2: Installing backend dependencies..."
cd server

# Check if we should use a virtual environment
if [[ ! -d "venv" ]]; then
    print_status "Creating Python virtual environment..."
    if python3 -m venv venv; then
        print_success "Virtual environment created"
    else
        print_warning "Failed to create virtual environment, proceeding with system Python"
    fi
fi

# Activate virtual environment if it exists
if [[ -d "venv" ]]; then
    print_status "Activating virtual environment..."
    source venv/bin/activate
    print_success "Virtual environment activated"
fi

# Try pip3 first, then pip
if command -v pip3 &> /dev/null; then
    PIP_CMD="pip3"
elif command -v pip &> /dev/null; then
    PIP_CMD="pip"
else
    print_error "Neither pip nor pip3 found. Please install Python pip"
    exit 1
fi

print_status "Installing Python dependencies with $PIP_CMD..."
if $PIP_CMD install -r requirements.txt; then
    print_success "Backend dependencies installed"
else
    print_error "Failed to install backend dependencies"
    print_warning "Make sure you have Python 3.9+ and pip installed"
    print_warning "You may need to run: python3 -m pip install -r requirements.txt"
    exit 1
fi
cd ..

print_status "Checking if PostgreSQL is running..."

if command -v pg_isready &> /dev/null; then
    if pg_isready -q; then
        print_success "PostgreSQL is running."
    else
        print_error "PostgreSQL server is NOT running (or not installed)!"
        print_error "Please ensure PostgreSQL is installed and running, then re-run this script."
        print_status "On Ubuntu, you might start it with: sudo systemctl start postgresql"
        exit 1
    fi
else
    print_warning "'pg_isready' command not found. Trying direct connection check with psql..."
    if psql -lqt &> /dev/null; then
        print_success "PostgreSQL seems to be running."
    else
        print_error "PostgreSQL server is NOT running (or not installed)!"
        print_error "Please ensure PostgreSQL is installed and running, then re-run this script."
        print_status "On Ubuntu, you might start it with: sudo systemctl start postgresql"
        exit 1
    fi
fi

print_status "Step 3: Setting up PostgreSQL database..."

# Ensure the 'postgres' role exists.
# We first check if the role exists. If not, we try to create it.
# The `createuser` command is used as it's the standard utility for this.
print_status "Ensuring PostgreSQL role 'postgres' exists..."
if psql -tAc "SELECT 1 FROM pg_roles WHERE rolname='postgres'" | grep -q 1; then
    print_success "Role 'postgres' already exists."
else
    print_status "Role 'postgres' not found. Attempting to create it..."
    if createuser postgres; then
        print_success "Role 'postgres' created successfully."
    else
        print_warning "Failed to create role 'postgres'. This might require superuser privileges."
        print_warning "You may need to run 'createuser postgres' manually as a PostgreSQL superuser."
        print_status "Continuing, but database initialization may fail."
    fi
fi

# Set password for the 'postgres' role.
print_status "Setting password for role 'postgres'..."
# We connect to the default 'template1' database as the current user to alter the role.
if psql -d template1 -c "ALTER ROLE postgres WITH LOGIN PASSWORD 'password';" >/dev/null 2>&1; then
    print_success "Password for role 'postgres' is set."
else
    print_warning "Could not set password for role 'postgres'. This might be a permissions issue."
    print_status "Continuing, but database connection may fail if the password is not 'password'."
fi

# Try to create database (will fail if it already exists, which is fine)
print_status "Creating database 'aquarian_gnosis'..." 
if createdb aquarian_gnosis 2>/dev/null; then
    print_success "Database 'aquarian_gnosis' created"
elif psql -lqt | cut -d \| -f 1 | grep -qw aquarian_gnosis; then
    print_success "Database 'aquarian_gnosis' already exists"
else
    print_error "Failed to create database. Please create it manually:"
    print_error "createdb aquarian_gnosis"
    exit 1
fi

print_status "Step 4: Initializing database schema..."
cd server
if python init_db.py; then
    print_success "Database schema initialized"
else
    print_error "Failed to initialize database schema"
    exit 1
fi
cd ..

print_status "Step 5: Verifying setup..."

# Check if all required files exist
required_files=(
    "client/package.json"
    "server/requirements.txt" 
    "server/.env"
    "server/app/main.py"
    "server/init_db.py"
)

for file in "${required_files[@]}"; do
    if [[ -f "$file" ]]; then
        print_success "✓ $file exists"
    else
        print_error "✗ $file is missing"
        exit 1
    fi
done

echo ""
print_success "🎉 Setup complete! Aquarian Gnosis is ready for local development."
echo ""
echo "Next steps:"
echo "1. Start the application:"
echo "   ./run.sh"
echo ""
echo "2. Or start with PM2:"
echo "   pm2 start run.sh --name aquarian-gnosis"
echo ""
echo "3. Open your browser to:"
echo "   Frontend: http://localhost:5173"
echo "   Backend API: http://localhost:8000"
echo "   API Docs: http://localhost:8000/docs"
echo ""
print_status "Happy coding! 🚀"
