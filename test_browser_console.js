#!/usr/bin/env node

const puppeteer = require('puppeteer');

async function testBrowserConsole() {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        const page = await browser.newPage();
        
        // Track console messages
        const consoleMessages = [];
        const errors = [];
        
        page.on('console', (msg) => {
            const type = msg.type();
            const text = msg.text();
            
            consoleMessages.push({ type, text });
            
            if (type === 'error') {
                errors.push(text);
            }
        });
        
        // Track page errors
        page.on('pageerror', (error) => {
            errors.push(`Page Error: ${error.message}`);
        });
        
        // Track request failures
        page.on('requestfailed', (request) => {
            errors.push(`Request Failed: ${request.url()} - ${request.failure().errorText}`);
        });
        
        console.log('🔍 Testing Browser Console Errors');
        console.log('=================================');
        
        // Navigate to the app
        console.log('📱 Loading http://localhost:3000...');
        
        try {
            await page.goto('http://localhost:3000', { 
                waitUntil: 'networkidle0',
                timeout: 10000 
            });
            
            // Wait a bit more for any async imports/modules to load
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            console.log('✅ Page loaded successfully');
            
        } catch (navError) {
            console.log(`❌ Navigation failed: ${navError.message}`);
            return false;
        }
        
        // Analyze results
        console.log(`\n📊 Console Messages: ${consoleMessages.length} total`);
        
        // Filter critical errors
        const criticalErrors = errors.filter(error => {
            return error.includes('does not provide an export') ||
                   error.includes('Module does not provide export') ||
                   error.includes('SyntaxError') ||
                   error.includes('Cannot resolve module') ||
                   error.includes('Failed to resolve') ||
                   error.includes('Uncaught');
        });
        
        // Show all console messages for debugging
        if (consoleMessages.length > 0) {
            console.log('\n📋 All Console Messages:');
            consoleMessages.forEach((msg, index) => {
                const prefix = msg.type === 'error' ? '❌' : 
                              msg.type === 'warn' ? '⚠️ ' : 
                              msg.type === 'info' ? 'ℹ️ ' : '💬';
                console.log(`   ${index + 1}. ${prefix} [${msg.type}] ${msg.text}`);
            });
        }
        
        // Report results
        if (criticalErrors.length > 0) {
            console.log('\n❌ CRITICAL ERRORS FOUND:');
            criticalErrors.forEach((error, index) => {
                console.log(`   ${index + 1}. ${error}`);
            });
            console.log('\n🚨 TEST FAILED - JavaScript errors detected!');
            return false;
            
        } else if (errors.length > 0) {
            console.log('\n⚠️  Non-critical errors found:');
            errors.forEach((error, index) => {
                console.log(`   ${index + 1}. ${error}`);
            });
            console.log('\n✅ TEST PASSED - No critical JavaScript errors');
            return true;
            
        } else {
            console.log('\n✅ TEST PASSED - No JavaScript errors detected!');
            return true;
        }
        
    } catch (error) {
        console.log(`❌ Test failed with error: ${error.message}`);
        return false;
        
    } finally {
        await browser.close();
    }
}

// Run the test
if (require.main === module) {
    testBrowserConsole().then(success => {
        process.exit(success ? 0 : 1);
    }).catch(error => {
        console.error('❌ Test script failed:', error);
        process.exit(1);
    });
}

module.exports = testBrowserConsole;