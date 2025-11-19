require('dotenv').config();
const jwt = require('jsonwebtoken');

// Generate a test token
const JWT_SECRET = process.env.JWT_SECRET || 'luxeli_super_secret_key_2025';

const payload = {
  userId: 'test-user-id',
  email: 'test@example.com',
  role: 'partner',
  userType: 'partner'
};

const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

console.log('Generated test token:');
console.log(token);

// Also test if we can verify it
try {
  const decoded = jwt.verify(token, JWT_SECRET);
  console.log('Token verified successfully:');
  console.log(decoded);
} catch (error) {
  console.error('Token verification failed:', error);
}