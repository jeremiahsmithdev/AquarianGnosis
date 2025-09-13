const puppeteer = require('puppeteer');

async function testMapFunctionality() {
  console.log('🚀 Starting map functionality test...');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: { width: 1280, height: 720 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Enable console logging from the page
  page.on('console', msg => {
    const type = msg.type();
    if (type === 'error') {
      console.log('❌ Browser Error:', msg.text());
    } else if (type === 'warn') {
      console.log('⚠️  Browser Warning:', msg.text());
    } else {
      console.log('📝 Browser Log:', msg.text());
    }
  });
  
  // Listen for page errors
  page.on('pageerror', error => {
    console.log('💥 Page Error:', error.message);
  });
  
  try {
    console.log('📍 Navigating to localhost:3000...');
    await page.goto('http://localhost:3000', { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    console.log('✅ Page loaded successfully');
    
    // Wait for the page to be fully loaded
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check if there are any JavaScript errors related to getPublicLocations
    const errors = await page.evaluate(() => {
      return window.console.errors || [];
    });
    
    // Look for the map navigation button and click it
    console.log('🗺️  Looking for map navigation...');
    
    // Try to find and click the map button
    const mapButton = await page.evaluateHandle(() => {
      // Look for buttons with text containing "Map"
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.find(btn => 
        btn.textContent?.toLowerCase().includes('map') ||
        btn.getAttribute('data-page') === 'map'
      );
    });
    
    const mapButtonExists = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.some(btn => 
        btn.textContent?.toLowerCase().includes('map') ||
        btn.getAttribute('data-page') === 'map'
      );
    });
    
    if (mapButtonExists) {
      console.log('🎯 Found map button, clicking...');
      await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const mapBtn = buttons.find(btn => 
          btn.textContent?.toLowerCase().includes('map') ||
          btn.getAttribute('data-page') === 'map'
        );
        if (mapBtn) mapBtn.click();
      });
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Check if map page loaded without errors
      const currentUrl = page.url();
      console.log('📍 Current URL:', currentUrl);
      
      // Look for map-related elements
      const mapElements = await page.evaluate(() => {
        const mapContainer = document.querySelector('.map-container, #map, .leaflet-container');
        const mapStats = document.querySelector('.map-stats, .stats-container');
        const locationsList = document.querySelector('.locations-list, .public-locations');
        
        return {
          hasMapContainer: !!mapContainer,
          hasMapStats: !!mapStats,
          hasLocationsList: !!locationsList,
          mapContainerClass: mapContainer?.className || 'not found',
          bodyText: document.body.innerText.substring(0, 500)
        };
      });
      
      console.log('🗺️  Map elements check:', mapElements);
      
      // Check for any console errors specifically about getPublicLocations
      const jsErrors = await page.evaluate(() => {
        return window.jsErrors || [];
      });
      
      if (jsErrors.length > 0) {
        console.log('❌ JavaScript errors found:', jsErrors);
      } else {
        console.log('✅ No JavaScript errors detected');
      }
      
    } else {
      console.log('⚠️  Map button not found, checking current page content...');
      
      // Check what's on the current page
      const pageContent = await page.evaluate(() => {
        return {
          title: document.title,
          buttons: Array.from(document.querySelectorAll('button')).map(btn => btn.textContent?.trim()).filter(Boolean),
          links: Array.from(document.querySelectorAll('a')).map(link => link.textContent?.trim()).filter(Boolean),
          hasMapContent: document.body.innerText.toLowerCase().includes('map'),
          bodyText: document.body.innerText.substring(0, 300)
        };
      });
      
      console.log('📄 Page content:', pageContent);
    }
    
    // Wait a bit more to see if any delayed errors occur
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    console.log('✅ Map functionality test completed');
    
  } catch (error) {
    console.log('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

// Run the test
testMapFunctionality().catch(console.error);