#!/bin/bash

# Test Vite Module Resolution
# Checks if Vite dev server can serve the types module correctly

echo "🔍 Testing Vite Module Resolution"
echo "================================="

# Test 1: Check if types file exists
echo ""
echo "📁 Checking types file existence..."
if [ -f "client/src/types/index.ts" ]; then
    echo "✅ Types file exists"
    echo "📋 Exports found:"
    grep "export interface" client/src/types/index.ts | sed 's/export interface /   - /' | sed 's/ {//'
else
    echo "❌ Types file does not exist"
    exit 1
fi

# Test 2: Check if Vite can serve the types file
echo ""
echo "🌐 Testing Vite dev server access to types..."
TYPES_URL="http://localhost:3000/src/types/index.ts"
TYPES_RESPONSE=$(curl -s "$TYPES_URL")

if [ $? -eq 0 ] && [ -n "$TYPES_RESPONSE" ]; then
    echo "✅ Vite can serve types file"
    
    # Check if LoginRequest is in the response
    if echo "$TYPES_RESPONSE" | grep -q "LoginRequest"; then
        echo "✅ LoginRequest found in served content"
    else
        echo "❌ LoginRequest NOT found in served content"
        echo "📋 First 200 chars of response:"
        echo "$TYPES_RESPONSE" | head -c 200
    fi
else
    echo "❌ Vite cannot serve types file"
    echo "Response code: $?"
fi

# Test 3: Try to test with a minimal TypeScript file
echo ""
echo "🧪 Creating minimal test import..."
cat > client/test-minimal.ts << 'EOF'
import { LoginRequest } from './src/types/index';

const test: LoginRequest = {
    username: 'test',
    password: 'test'
};
EOF

cd client
echo "🔧 Testing TypeScript compilation..."
npx tsc --noEmit test-minimal.ts 2>&1 | head -10

# Clean up
rm -f test-minimal.ts
cd ..

echo ""
echo "📊 Vite Module Test Complete"