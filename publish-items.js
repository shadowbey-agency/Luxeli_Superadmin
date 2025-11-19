require('dotenv').config();
const mongoose = require('mongoose');
const { RequestsManagement } = require('./models/housekeeping/index.ts');

async function publishItems() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to database');
    
    // Find all items and publish them
    const items = await RequestsManagement.find({});
    console.log('Total items found:', items.length);
    
    for (const item of items) {
      if (item.status !== 'published') {
        item.status = 'published';
        await item.save();
        console.log(`Published item: ${item.name}`);
      } else {
        console.log(`Item already published: ${item.name}`);
      }
    }
    
    console.log('All items processed');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
  }
}

publishItems();