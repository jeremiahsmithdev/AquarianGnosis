const puppeteer = require('puppeteer');

async function testMapErrors() {
  console.log('🔍 Testing for map-related errors...');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: { width: 1280, height: 720 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Collect all console messages
  const consoleMessages = [];
  const errors = [];
  
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    consoleMessages.push({ type, text });
    
    if (type === 'error') {
      console.log('❌ Console Error:', text);
      errors.push(text);
    }
  });
  
  // Listen for page errors
  page.on('pageerror', error => {
    console.log('💥 Page Error:', error.message);
    errors.push(error.message);
  });
  
  // Listen for failed requests
  page.on('requestfailed', request => {
    console.log('🚫 Failed Request:', request.url(), request.failure()?.errorText);
  });
  
  try {
    console.log('📍 Navigating to map page...');
    await page.goto('http://localhost:3000/map', { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    console.log('✅ Map page loaded');
    
    // Wait for any async operations to complete
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Check specifically for getPublicLocations errors
    const hasGetPublicLocationsError = errors.some(error => 
      error.includes('getPublicLocations') || 
      error.includes('is not a function')
    );
    
    if (hasGetPublicLocationsError) {
      console.log('❌ Found getPublicLocations error!');
      const relevantErrors = errors.filter(error => 
        error.includes('getPublicLocations') || 
        error.includes('is not a function')
      );
      console.log('Relevant errors:', relevantErrors);
    } else {
      console.log('✅ No getPublicLocations errors found');
    }
    
    // Check if map data is loading
    const mapData = await page.evaluate(() => {
      return {
        publicLocationsText: document.body.innerText.match(/Public locations: (\d+)/)?.[1] || 'not found',
        hasMapContainer: !!document.querySelector('.leaflet-container'),
        hasMapStats: !!document.querySelector('.map-stats'),
        totalErrors: window.console?.errors?.length || 0
      };
    });
    
    console.log('🗺️  Map data:', mapData);
    
    // Summary
    console.log('\n📊 Test Summary:');
    console.log(`Total console messages: ${consoleMessages.length}`);
    console.log(`Total errors: ${errors.length}`);
    console.log(`Map container present: ${mapData.hasMapContainer}`);
    console.log(`Public locations: ${mapData.publicLocationsText}`);
    
    if (errors.length === 0) {
      console.log('🎉 SUCCESS: No errors detected!');
    } else {
      console.log('⚠️  Errors found:', errors);
    }
    
  } catch (error) {
    console.log('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

// Run the test
testMapErrors().catch(console.error);