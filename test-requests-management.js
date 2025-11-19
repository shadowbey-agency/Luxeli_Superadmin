require('dotenv').config();
const mongoose = require('mongoose');
const { RequestsManagement } = require('./models/housekeeping');

async function test() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to database');
    
    const items = await RequestsManagement.find({ status: 'published' }).limit(5);
    console.log('Published items:', items.length);
    
    if (items.length > 0) {
      console.log('First item:', items[0].toJSON());
    }
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
  }
}

test();