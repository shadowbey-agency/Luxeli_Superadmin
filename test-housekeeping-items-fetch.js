const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testHousekeepingItemsAPI() {
  try {
    // First, let's try to get a sample token (this would normally come from a logged-in user)
    console.log('Testing housekeeping items API...');
    
    // Try to fetch housekeeping items
    const response = await fetch('http://localhost:3000/api/housekeeping-items');
    
    console.log(`Status: ${response.status}`);
    console.log(`Status Text: ${response.statusText}`);
    
    const data = await response.json();
    console.log('Response data:', JSON.stringify(data, null, 2));
    
    if (data.success) {
      console.log(`Successfully fetched ${data.data.items.length} items`);
      if (data.data.items.length > 0) {
        console.log('First item:', JSON.stringify(data.data.items[0], null, 2));
      }
    } else {
      console.log('API returned error:', data.error);
    }
  } catch (error) {
    console.error('Error testing housekeeping items API:', error.message);
  }
}

testHousekeepingItemsAPI();