require('dotenv').config();
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/luxeli')
  .then(async () => {
    console.log('MongoDB connected successfully');
    
    // Import the HousekeepingRequest model
    const { HousekeepingRequest } = require('./models/housekeeping');
    
    // Check if we have requests with images
    const requests = await HousekeepingRequest.find({ 
      type: 'item needed', 
      itemImage: { $exists: true } 
    }).limit(5);
    
    console.log('Found requests:', requests.length);
    
    if (requests.length > 0) {
      console.log('Sample request:', {
        id: requests[0]._id,
        title: requests[0].requestedFor,
        description: requests[0].notes,
        image: requests[0].itemImage,
        quantity: requests[0].itemQuantity
      });
    }
    
    mongoose.connection.close();
  })
  .catch(error => {
    console.error('Error:', error);
  });