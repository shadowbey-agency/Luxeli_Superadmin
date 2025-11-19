const http = require('http');

// Test the housekeeping items API endpoint
const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/housekeeping-items',
  method: 'GET',
  headers: {
    'Authorization': 'Bearer sample-token'
  }
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers: ${JSON.stringify(res.headers)}`);
  
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:');
    console.log(JSON.stringify(JSON.parse(data), null, 2));
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.end();