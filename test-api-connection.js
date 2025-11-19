const http = require('http');

// Test connection to the API
const options = {
  hostname: '192.168.18.26',
  port: 3001,
  path: '/api/partner/housekeeping-items',
  method: 'GET',
  timeout: 5000
};

const req = http.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  console.log(`Headers: ${JSON.stringify(res.headers)}`);
  
  res.on('data', (chunk) => {
    console.log(`Body: ${chunk}`);
  });
  
  res.on('end', () => {
    console.log('Request completed');
  });
});

req.on('error', (error) => {
  console.error('Request error:', error.message);
});

req.on('timeout', () => {
  console.error('Request timeout');
  req.destroy();
});

req.end();