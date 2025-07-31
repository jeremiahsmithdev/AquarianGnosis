#!/bin/bash

# Single Change Testing Script
# Tests one change at a time with proper verification

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'  
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[TEST]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[PASS]${NC} $1"
}

print_error() {
    echo -e "${RED}[FAIL]${NC} $1"
}

# Function to test app after a change
test_change() {
    local change_description="$1"
    echo ""
    echo "🧪 Testing: $change_description"
    echo "================================"
    
    # Wait for restart to complete
    sleep 3
    
    # Test 1: Basic connectivity
    print_status "Testing basic connectivity..."
    if ! curl -s -f http://localhost:3000 >/dev/null 2>&1; then
        print_error "Frontend not responding - CHANGE FAILED"
        return 1
    fi
    print_success "Frontend responding"
    
    # Test 2: Check for HTML structure
    print_status "Testing HTML structure..."
    FRONTEND_HTML=$(curl -s http://localhost:3000)
    if ! echo "$FRONTEND_HTML" | grep -q '<div id="root">'; then
        print_error "Root div missing - CHANGE FAILED"  
        return 1
    fi
    print_success "HTML structure intact"
    
    # Test 3: Check main JS loads
    print_status "Testing JavaScript entry point..."
    if ! echo "$FRONTEND_HTML" | grep -q 'src="/src/main\.tsx"'; then
        print_error "Main JS entry missing - CHANGE FAILED"
        return 1
    fi
    print_success "JavaScript entry point found"
    
    # Test 4: Quick backend check
    print_status "Testing backend connectivity..."
    if ! curl -s -f http://localhost:8000/health >/dev/null 2>&1; then
        print_error "Backend not responding - CHANGE FAILED"
        return 1
    fi
    print_success "Backend responding"
    
    print_success "✅ Change appears successful: $change_description"
    echo ""
    echo "⚠️  MANUAL VERIFICATION REQUIRED:"
    echo "   1. Open http://localhost:3000 in browser"
    echo "   2. Check Console tab for JavaScript errors" 
    echo "   3. Verify page loads and shows content"
    echo "   4. Confirm no 'Module does not provide export' errors"
    echo ""
    
    return 0
}

# Usage
if [ "$#" -eq 0 ]; then
    echo "Usage: ./test_single_change.sh 'Description of change'"
    echo "Example: ./test_single_change.sh 'Convert LoginForm to centralized types'"
    exit 1
fi

test_change "$1"