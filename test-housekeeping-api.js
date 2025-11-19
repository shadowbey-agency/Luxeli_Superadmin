const http = require('http');

// Test the housekeeping requests API endpoint
const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/partner/housekeeping-requests?type=item%20needed&page=1&limit=20',
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_TEST_TOKEN_HERE'
  }
};

console.log('Testing housekeeping requests API endpoint...');
console.log('URL:', `http://${options.hostname}:${options.port}${options.path}`);

const req = http.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  
  res.on('data', (chunk) => {
    console.log('Response received:');
    try {
      const data = JSON.parse(chunk);
      console.log(JSON.stringify(data, null, 2));
    } catch (e) {
      console.log(chunk.toString());
    }
  });
});

req.on('error', (error) => {
  console.error('Error:', error.message);
});

req.end();