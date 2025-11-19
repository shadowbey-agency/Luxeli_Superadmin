const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const jwt = require('jsonwebtoken');

async function testPartnerHousekeepingItemsAPI() {
  try {
    // Generate a test token
    const JWT_SECRET = process.env.JWT_SECRET || 'luxeli_super_secret_key_2025';
    
    const payload = {
      userId: 'test-user-id',
      email: 'test@example.com',
      role: 'partner',
      userType: 'partner'
    };
    
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
    console.log('Generated test token:', token);
    
    // Try to fetch partner housekeeping items
    console.log('Testing partner housekeeping items API...');
    
    const response = await fetch('http://localhost:3000/api/partner/housekeeping-items', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log(`Status: ${response.status}`);
    console.log(`Status Text: ${response.statusText}`);
    
    const data = await response.json();
    console.log('Response data:', JSON.stringify(data, null, 2));
    
    if (data.success) {
      console.log(`Successfully fetched ${data.data.items.length} items`);
      if (data.data.items.length > 0) {
        console.log('First item:', JSON.stringify(data.data.items[0], null, 2));
      } else {
        console.log('No items found in the database');
      }
    } else {
      console.log('API returned error:', data.error);
    }
  } catch (error) {
    console.error('Error testing partner housekeeping items API:', error.message);
  }
}

testPartnerHousekeepingItemsAPI();