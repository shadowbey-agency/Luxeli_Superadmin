const http = require('http');

// Generate a test token (this mimics what the Flutter app would have)
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'luxeli_super_secret_key_2025';

const payload = {
  userId: 'test-user-id',
  email: 'test@example.com',
  role: 'partner',
  userType: 'partner'
};

const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
console.log('Generated test token:', token.substring(0, 50) + '...');

// Test the housekeeping items API endpoint with the token
const options = {
  hostname: '192.168.18.26',
  port: 3001,
  path: '/api/partner/housekeeping-items',
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  timeout: 10000
};

console.log('Making request to:', `http://${options.hostname}:${options.port}${options.path}`);

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers: ${JSON.stringify(res.headers)}`);
  
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response received');
    try {
      if (data) {
        const jsonData = JSON.parse(data);
        console.log('Response data:');
        console.log(JSON.stringify(jsonData, null, 2));
      } else {
        console.log('Empty response body');
      }
    } catch (error) {
      console.log('Raw response:', data);
      console.error('Error parsing JSON:', error);
    }
  });
});

req.on('error', (error) => {
  console.error('Request error:', error);
});

req.on('timeout', () => {
  console.error('Request timeout');
  req.destroy();
});

req.end();