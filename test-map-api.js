const puppeteer = require('puppeteer');

async function testMapAPI() {
  console.log('🌐 Testing map API endpoints...');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: { width: 1280, height: 720 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Track network requests
  const requests = [];
  const responses = [];
  
  page.on('request', request => {
    if (request.url().includes('/api/')) {
      requests.push({
        url: request.url(),
        method: request.method()
      });
      console.log(`📤 API Request: ${request.method()} ${request.url()}`);
    }
  });
  
  page.on('response', response => {
    if (response.url().includes('/api/')) {
      responses.push({
        url: response.url(),
        status: response.status(),
        statusText: response.statusText()
      });
      console.log(`📥 API Response: ${response.status()} ${response.url()}`);
    }
  });
  
  try {
    console.log('📍 Loading map page...');
    await page.goto('http://localhost:3000/map', { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    // Wait for API calls to complete
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('\n📊 API Test Results:');
    console.log(`Total API requests: ${requests.length}`);
    console.log(`Total API responses: ${responses.length}`);
    
    // Check for specific map endpoints
    const mapEndpoints = [
      '/api/v1/map/locations/public',
      '/api/v1/map/stats'
    ];
    
    mapEndpoints.forEach(endpoint => {
      const request = requests.find(req => req.url.includes(endpoint));
      const response = responses.find(res => res.url.includes(endpoint));
      
      if (request && response) {
        console.log(`✅ ${endpoint}: ${response.status} ${response.statusText}`);
      } else if (request) {
        console.log(`⏳ ${endpoint}: Request sent, waiting for response...`);
      } else {
        console.log(`❌ ${endpoint}: No request found`);
      }
    });
    
    // Check if any requests failed
    const failedRequests = responses.filter(res => res.status >= 400);
    if (failedRequests.length > 0) {
      console.log('\n❌ Failed requests:');
      failedRequests.forEach(req => {
        console.log(`  ${req.status} ${req.url}`);
      });
    } else {
      console.log('\n✅ All API requests successful!');
    }
    
  } catch (error) {
    console.log('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

// Run the test
testMapAPI().catch(console.error);