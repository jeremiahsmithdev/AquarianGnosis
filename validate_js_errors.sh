#!/bin/bash

# JavaScript Console Error Detection Script
# This script attempts to detect JavaScript runtime errors that basic HTTP tests miss

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() { echo -e "${BLUE}[VALIDATE]${NC} $1"; }
print_success() { echo -e "${GREEN}[PASS]${NC} $1"; }
print_error() { echo -e "${RED}[FAIL]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[WARN]${NC} $1"; }

echo "🔍 JavaScript Error Detection"
echo "============================="

# Test 1: Check PM2 logs for errors
print_status "Checking PM2 logs for JavaScript errors..."
FRONTEND_LOGS=$(npm run pm2:logs -- --lines 20 2>/dev/null | grep -i "error\|fail\|exception\|syntaxerror\|cannot.*find.*module\|does.*not.*provide.*export" || echo "")

if [ -n "$FRONTEND_LOGS" ]; then
    print_error "JavaScript errors found in PM2 logs:"
    echo "$FRONTEND_LOGS"
    echo ""
else
    print_success "No obvious errors in PM2 logs"
fi

# Test 2: Check TypeScript compilation
print_status "Checking TypeScript compilation..."
cd client
COMPILE_OUTPUT=$(npx tsc --noEmit 2>&1 || echo "COMPILATION_FAILED")

if echo "$COMPILE_OUTPUT" | grep -q "COMPILATION_FAILED\|error TS"; then
    print_error "TypeScript compilation errors found:"
    echo "$COMPILE_OUTPUT" | head -10
else
    print_success "TypeScript compilation clean"
fi
cd ..

echo ""
print_error "🚨 CRITICAL LIMITATION:"
echo "   ⚠️  This script CANNOT detect JavaScript runtime errors that occur in the browser!"
echo "   ⚠️  Browser console errors like 'Module does not provide export' will NOT be caught!"
echo ""
echo "   TO PROPERLY VALIDATE CHANGES:"
echo "   1. Open http://localhost:3000 in browser"
echo "   2. Open Developer Tools (F12)" 
echo "   3. Watch Console tab during page load"
echo "   4. Look for 'Module does not provide export' or 'SyntaxError' messages"
echo "   5. Only proceed if console is completely clean"