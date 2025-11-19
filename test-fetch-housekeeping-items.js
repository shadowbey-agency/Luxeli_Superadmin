const http = require('http');

// Use the token we generated earlier
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0LXVzZXItaWQiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJyb2xlIjoicGFydG5lciIsInVzZXJUeXBlIjoicGFydG5lciIsImlhdCI6MTc2MzIwMTQ4MywiZXhwIjoxNzYzMjA1MDgzfQ.x3gOrKAfvU0F7Hr7ut1W4xXsYjw6siXZvtVq_yORGXo';

// Test fetching housekeeping items
const options = {
  hostname: 'localhost',
  port: 3002,
  path: '/api/partner/housekeeping-items',
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
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
    try {
      const jsonData = JSON.parse(data);
      console.log(JSON.stringify(jsonData, null, 2));
    } catch (error) {
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.end();