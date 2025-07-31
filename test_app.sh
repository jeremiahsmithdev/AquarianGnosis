#!/bin/bash

# App Testing Script - Detects Console Errors and Verifies Functionality
# Usage: ./test_app.sh

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[TEST]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[PASS]${NC} $1"
}

print_error() {
    echo -e "${RED}[FAIL]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

echo "🧪 Testing Aquarian Gnosis Application"
echo "======================================="

# Test 1: Check if both services are running
print_status "Checking service availability..."

if curl -s -f http://localhost:8000/health >/dev/null 2>&1; then
    print_success "Backend is responding (port 8000)"
else
    print_error "Backend is not responding on port 8000"
    exit 1
fi

if curl -s -f http://localhost:3000 >/dev/null 2>&1; then
    print_success "Frontend is responding (port 3000)"
else
    print_error "Frontend is not responding on port 3000" 
    exit 1
fi

# Test 2: Check frontend HTML loads properly
print_status "Checking frontend HTML structure..."
FRONTEND_HTML=$(curl -s http://localhost:3000)

if echo "$FRONTEND_HTML" | grep -q '<div id="root">'; then
    print_success "Root div found in HTML"
else
    print_error "Root div missing from HTML"
fi

if echo "$FRONTEND_HTML" | grep -q 'Aquarian Gnosis'; then
    print_success "App title found in HTML"
else
    print_warning "App title not found in HTML"
fi

# Test 3: Check for JavaScript module loading errors
print_status "Checking for JavaScript module errors..."
MAIN_JS_PATH=$(echo "$FRONTEND_HTML" | grep -o 'src="/src/main\.tsx"' || echo "")

if [ -n "$MAIN_JS_PATH" ]; then
    print_success "Main JavaScript entry point found"
else
    print_warning "Main JavaScript entry point not found or different path"
fi

# Test 4: Check backend API endpoints
print_status "Testing backend API endpoints..."

# Health endpoint
if curl -s -f http://localhost:8000/health | grep -q "healthy"; then
    print_success "Health endpoint working"
else
    print_error "Health endpoint not working"
fi

# Root endpoint  
if curl -s -f http://localhost:8000 | grep -q "Aquarian Gnosis"; then
    print_success "Root API endpoint working"
else
    print_error "Root API endpoint not working"
fi

# API docs endpoint
if curl -s -f http://localhost:8000/docs >/dev/null 2>&1; then
    print_success "API docs endpoint accessible"
else
    print_warning "API docs endpoint not accessible"
fi

# Test 5: Check PM2 process health
print_status "Checking PM2 process health..."
PM2_STATUS=$(npm run pm2:status 2>/dev/null || echo "PM2 not available")

if echo "$PM2_STATUS" | grep -q "online.*aquarian-gnosis-backend"; then
    print_success "Backend PM2 process is online"
else
    print_error "Backend PM2 process is not online"
fi

if echo "$PM2_STATUS" | grep -q "online.*aquarian-gnosis-frontend"; then
    print_success "Frontend PM2 process is online"  
else
    print_error "Frontend PM2 process is not online"
fi

# Test 6: Check for TypeScript/Vite errors in logs
print_status "Checking for TypeScript/build errors..."
if [ -f "/Users/admin/dev/AquarianGnosis/client/logs/frontend-error-5.log" ]; then
    RECENT_ERRORS=$(tail -10 "/Users/admin/dev/AquarianGnosis/client/logs/frontend-error-5.log" 2>/dev/null || echo "")
    
    if echo "$RECENT_ERRORS" | grep -q -i "error\|fail\|exception"; then
        print_error "Recent errors found in frontend logs:"
        echo "$RECENT_ERRORS"
    else
        print_success "No recent errors in frontend logs"
    fi
else
    print_warning "Frontend error log not found"
fi

echo ""
echo "🎯 Test Summary Complete"
echo "======================="

# Function to check for console errors (requires browser automation, placeholder for now)
print_status "Note: To check for browser console errors, open http://localhost:3000"
print_status "and check the browser developer console for JavaScript errors."

echo ""
echo "✅ Quick Manual Verification:"
echo "   1. Open http://localhost:3000 in browser"
echo "   2. Open Developer Tools (F12)"  
echo "   3. Check Console tab for errors"
echo "   4. Verify page loads and shows Aquarian Gnosis content"