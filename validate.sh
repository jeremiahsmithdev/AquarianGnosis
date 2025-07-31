#!/bin/bash

# Aquarian Gnosis - Validation Script
# Quick validation of setup and dependencies

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

echo "🔍 Validating Aquarian Gnosis Setup..."
echo "═══════════════════════════════════════"

# Check if we're in the right directory
if [[ ! -f "package.json" ]] || [[ ! -d "server" ]] || [[ ! -d "client" ]]; then
    print_error "Please run this script from the AquarianGnosis root directory"
    exit 1
fi

print_status "Checking system requirements..."

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_success "✓ Node.js found: $NODE_VERSION"
else
    print_error "✗ Node.js not found. Please install Node.js 18+"
    exit 1
fi

# Check Python
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version)
    print_success "✓ Python found: $PYTHON_VERSION"
else
    print_error "✗ Python3 not found. Please install Python 3.9+"
    exit 1
fi

# Check PostgreSQL
if command -v psql &> /dev/null; then
    POSTGRES_VERSION=$(psql --version)
    print_success "✓ PostgreSQL found: $POSTGRES_VERSION"
else
    print_error "✗ PostgreSQL not found. Please install PostgreSQL 12+"
    exit 1
fi

# Check if PostgreSQL is running
if pg_isready -q; then
    print_success "✓ PostgreSQL is running"
else
    print_warning "⚠ PostgreSQL is not running"
    print_status "Start with: brew services start postgresql (macOS) or sudo systemctl start postgresql (Linux)"
fi

print_status "Checking project structure..."

# Check key files
key_files=(
    "package.json"
    "setup.sh"
    "run.sh"
    "ecosystem.config.js"
    "client/package.json"
    "server/requirements.txt"
    "server/app/main.py"
    "server/init_db.py"
    "server/.env"
)

for file in "${key_files[@]}"; do
    if [[ -f "$file" ]]; then
        print_success "✓ $file"
    else
        print_error "✗ $file missing"
        exit 1
    fi
done

print_status "Checking dependencies..."

# Check frontend dependencies
if [[ -d "client/node_modules" ]]; then
    print_success "✓ Frontend dependencies installed"
else
    print_warning "⚠ Frontend dependencies not installed"
    print_status "Run: cd client && npm install"
fi

# Check if Python dependencies can be imported
cd server
PYTHON_EXEC=python3
if [[ -f venv/bin/python ]]; then
  PYTHON_EXEC=venv/bin/python
fi

if $PYTHON_EXEC -c "
try:
    import fastapi, uvicorn, sqlalchemy, psycopg2
    print('✓ Python dependencies OK')
except ImportError as e:
    print(f'✗ Missing Python dependency: {e}')
    exit(1)
"; then
    print_success "✓ Backend dependencies available"
else
    print_warning "⚠ Backend dependencies missing"
    print_status "Run: cd server && pip install -r requirements.txt"
fi
cd ..

print_status "Checking database..."

# Check if database exists
if psql -lqt | cut -d \| -f 1 | grep -qw aquarian_gnosis; then
    print_success "✓ Database 'aquarian_gnosis' exists"
    
    # Check if tables exist
    if psql -d aquarian_gnosis -c "\dt" | grep -q users; then
        print_success "✓ Database tables initialized"
    else
        print_warning "⚠ Database tables not initialized"
        print_status "Run: cd server && python init_db.py"
    fi
else
    print_warning "⚠ Database 'aquarian_gnosis' does not exist"
    print_status "Run: createdb aquarian_gnosis"
fi

echo ""
print_status "Validation Summary:"

if pg_isready -q && [[ -d "client/node_modules" ]] && psql -lqt | cut -d \| -f 1 | grep -qw aquarian_gnosis; then
    print_success "🎉 Setup looks good! Ready to run the application."
    echo ""
    echo "Next steps:"
    echo "1. Start with PM2: npm run pm2:start"
    echo "2. Or start directly: ./run.sh"
    echo "3. Open browser: http://localhost:5173"
else
    print_warning "⚠ Some issues found. Run ./setup.sh to fix automatically."
fi

echo ""
print_status "For detailed testing instructions, see TESTING_GUIDE.md"