#!/bin/bash

# Safe Change Testing Script
# Tests one change at a time with Puppeteer validation

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() { echo -e "${BLUE}[SAFE-TEST]${NC} $1"; }
print_success() { echo -e "${GREEN}[PASS]${NC} $1"; }
print_error() { echo -e "${RED}[FAIL]${NC} $1"; }

# Function to test app after a change using Puppeteer
test_change_with_puppeteer() {
    local change_description="$1"
    echo ""
    echo "🧪 Testing: $change_description"
    echo "================================"
    
    # Wait for restart to complete
    print_status "Waiting for services to restart..."
    sleep 3
    
    # Use Puppeteer to test for JavaScript errors
    print_status "Running Puppeteer browser console test..."
    
    if node test_browser_console.js; then
        print_success "✅ CHANGE SUCCESSFUL: $change_description"
        echo "   No JavaScript runtime errors detected"
        return 0
    else
        print_error "❌ CHANGE FAILED: $change_description"
        echo "   JavaScript runtime errors detected - change must be reverted"
        return 1
    fi
}

# Usage
if [ "$#" -eq 0 ]; then
    echo "Usage: ./test_safe_change.sh 'Description of change'"
    echo "Example: ./test_safe_change.sh 'Convert LoginForm to centralized types'"
    echo ""
    echo "This script will:"
    echo "1. Wait for services to restart"
    echo "2. Run Puppeteer browser console test"
    echo "3. Report success/failure based on JavaScript errors"
    exit 1
fi

test_change_with_puppeteer "$1"