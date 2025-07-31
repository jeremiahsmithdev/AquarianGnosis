#!/usr/bin/env node

// Module Resolution Test  
// Tests if TypeScript/Vite can properly resolve our centralized types

const { readFileSync, existsSync, writeFileSync, unlinkSync } = require('fs');
const { join } = require('path');
const { exec } = require('child_process');

console.log('🔍 Testing Module Resolution for Types');
console.log('=====================================');

// Test 1: Check if types file exists and has proper exports
const typesFile = join(__dirname, 'client/src/types/index.ts');
console.log(`\n📁 Checking types file: ${typesFile}`);

if (!existsSync(typesFile)) {
    console.log('❌ Types file does not exist');
    process.exit(1);
}

const typesContent = readFileSync(typesFile, 'utf8');
const exports = [];
const lines = typesContent.split('\n');

lines.forEach((line, index) => {
    if (line.trim().startsWith('export interface ')) {
        const match = line.match(/export interface (\w+)/);
        if (match) {
            exports.push({
                name: match[1],
                line: index + 1
            });
        }
    }
});

console.log(`✅ Found ${exports.length} exported interfaces:`);
exports.forEach(exp => {
    console.log(`   - ${exp.name} (line ${exp.line})`);
});

// Check for LoginRequest specifically
const loginRequest = exports.find(exp => exp.name === 'LoginRequest');
if (loginRequest) {
    console.log(`✅ LoginRequest found at line ${loginRequest.line}`);
} else {
    console.log('❌ LoginRequest not found in exports');
}

// Test 2: Check TypeScript compilation
console.log('\n🔧 Testing TypeScript compilation...');
exec('cd client && npx tsc --noEmit --strict', (error, stdout, stderr) => {
    if (error) {
        console.log('❌ TypeScript compilation failed:');
        console.log(stderr);
    } else {
        console.log('✅ TypeScript compilation successful');
    }
    
    // Test 3: Create a test import file
    console.log('\n🧪 Testing import resolution...');
    
    const testImportContent = `
// Test import resolution
import { LoginRequest, User, RegisterRequest } from './src/types';

const testLogin: LoginRequest = {
    username: 'test',
    password: 'test'
};

const testUser: User = {
    id: '1',
    username: 'test',
    email: 'test@test.com',
    is_verified: false,
    is_active: true,
    created_at: '2025-01-01',
    updated_at: '2025-01-01'
};

console.log('Import test successful');
`;
    
    const testFile = join(__dirname, 'client/test-import.ts');
    writeFileSync(testFile, testImportContent);
    
    exec('cd client && npx tsc --noEmit test-import.ts', (error, stdout, stderr) => {
        // Clean up test file
        if (existsSync(testFile)) {
            unlinkSync(testFile);
        }
        
        if (error) {
            console.log('❌ Import resolution test failed:');
            console.log(stderr);
            
            // Check if it's a module resolution issue
            if (stderr.includes("Cannot find module") || stderr.includes("does not provide an export")) {
                console.log('\n🔍 Diagnosis: Module resolution issue detected');
                console.log('   This suggests Vite/TypeScript cannot properly resolve the types module');
                console.log('   Possible causes:');
                console.log('   - TypeScript configuration issue');
                console.log('   - Vite configuration issue');
                console.log('   - Path resolution problem');
                console.log('   - File compilation order issue');
            }
        } else {
            console.log('✅ Import resolution test successful');
        }
        
        console.log('\n📊 Module Resolution Test Complete');
    });
});