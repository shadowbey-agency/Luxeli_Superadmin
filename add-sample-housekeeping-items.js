const http = require('http');

// Use the token we generated earlier
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0LXVzZXItaWQiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJyb2xlIjoicGFydG5lciIsInVzZXJUeXBlIjoicGFydG5lciIsImlhdCI6MTc2MzIwMTQ4MywiZXhwIjoxNzYzMjA1MDgzfQ.x3gOrKAfvU0F7Hr7ut1W4xXsYjw6siXZvtVq_yORGXo';

// Sample items to add
const sampleItems = [
  {
    title: 'Extra Pillows',
    description: 'Fluffy pillows for a comfortable sleep',
    imageUrl: 'https://images.unsplash.com/photo-1568426762804-0073c8c1fc5a',
    category: 'Bedroom'
  },
  {
    title: 'Toothbrush Set',
    description: 'Complete set with toothbrush and toothpaste',
    imageUrl: 'https://images.unsplash.com/photo-1584078463836-8a6b6a0a8a0d',
    category: 'Bathroom'
  },
  {
    title: 'Coffee Maker',
    description: 'Fresh coffee whenever you need it',
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd',
    category: 'Kitchen'
  },
  {
    title: 'Hair Dryer',
    description: 'Professional grade hair dryer for your convenience',
    imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348',
    category: 'Bedroom'
  },
  {
    title: 'Shampoo & Conditioner',
    description: 'Premium quality hair care products',
    imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348',
    category: 'Bathroom'
  },
  {
    title: 'Microwave Oven',
    description: 'Heat up your food quickly and easily',
    imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348',
    category: 'Kitchen'
  },
  {
    title: 'Extra Blankets',
    description: 'Stay warm and cozy during your stay',
    imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348',
    category: 'Bedroom'
  },
  {
    title: 'Soap Set',
    description: 'Luxurious soap set for your bathing needs',
    imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348',
    category: 'Bathroom'
  },
  {
    title: 'Mini Fridge',
    description: 'Keep your drinks and snacks cool',
    imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348',
    category: 'Kitchen'
  },
  {
    title: 'Desk Lamp',
    description: 'Bright light for reading or working',
    imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348',
    category: 'Bedroom'
  }
];

// Function to add an item
function addItem(item) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(item);
    
    const options = {
      hostname: 'localhost',
      port: 3002,
      path: '/api/partner/housekeeping-items',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

// Add all sample items
async function addAllItems() {
  console.log('Adding sample housekeeping items...');
  
  for (let i = 0; i < sampleItems.length; i++) {
    try {
      const result = await addItem(sampleItems[i]);
      console.log(`✓ Added ${sampleItems[i].title}`);
    } catch (error) {
      console.error(`✗ Failed to add ${sampleItems[i].title}:`, error.message);
    }
  }
  
  console.log('Finished adding sample items.');
}

addAllItems();