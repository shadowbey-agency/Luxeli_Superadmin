require('dotenv').config();
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/luxeli')
  .then(async () => {
    console.log('MongoDB connected successfully');
    
    // Import models
    const HousekeepingRequest = require('./models/housekeeping/HousekeepingRequest').HousekeepingRequest;
    const HousekeepingItem = require('./models/housekeeping/HousekeepingItem').HousekeepingItem;
    
    // Get all unique items from existing housekeeping requests
    const requests = await HousekeepingRequest.find({ 
      type: 'item needed',
      itemImage: { $exists: true, $ne: null }
    }).lean();
    
    console.log(`Found ${requests.length} item requests`);
    
    // Create a map to avoid duplicates
    const uniqueItems = new Map();
    
    // Process each request to extract unique items
    for (const request of requests) {
      const key = `${request.requestedFor}-${request.notes}`;
      if (!uniqueItems.has(key)) {
        uniqueItems.set(key, {
          title: request.requestedFor,
          description: request.notes || 'No description available',
          imageUrl: request.itemImage,
          category: 'Other' // Default category
        });
      }
    }
    
    console.log(`Found ${uniqueItems.size} unique items`);
    
    // Create housekeeping items in the new collection
    let createdCount = 0;
    for (const [key, itemData] of uniqueItems) {
      try {
        // Check if item already exists
        const existingItem = await HousekeepingItem.findOne({
          title: itemData.title,
          description: itemData.description
        });
        
        if (!existingItem) {
          const newItem = new HousekeepingItem({
            partnerId: 'sample-partner-id', // This would be a real partner ID in production
            title: itemData.title,
            description: itemData.description,
            imageUrl: itemData.imageUrl,
            category: itemData.category,
            isActive: true
          });
          
          await newItem.save();
          createdCount++;
          console.log(`Created item: ${itemData.title}`);
        }
      } catch (error) {
        console.error(`Error creating item ${itemData.title}:`, error);
      }
    }
    
    console.log(`Successfully created ${createdCount} new housekeeping items`);
    
    mongoose.connection.close();
  })
  .catch(error => {
    console.error('Error:', error);
  });