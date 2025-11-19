const mongoose = require('mongoose');
require('dotenv').config();

async function listRequests() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/luxeli', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Define the schema directly
    const laundryRequestSchema = new mongoose.Schema({
      partnerId: { type: String, required: true, trim: true },
      service: { type: String, default: "laundry" },
      roomName: { type: String, required: true },
      roomId: { type: String, required: true },
      residentialName: { type: String, required: true },
      services: [{ type: String }],
      piece: { type: Number, required: true },
      pickup: { type: Date, required: true },
      status: { type: String, default: "new" },
      priority: { type: String, default: "medium" },
      notes: { type: String },
      assigne: {
        name: { type: String },
        staffId: { type: String },
        profilePic: { type: String },
      },
      userId: { type: String, trim: true },
    }, { timestamps: true });

    // Create the model
    const LaundryRequest = mongoose.model('LaundryRequest', laundryRequestSchema);

    // Fetch all laundry requests
    const requests = await LaundryRequest.find({}).sort({ createdAt: -1 }).limit(10).lean();
    
    console.log(`Found ${requests.length} laundry requests:`);
    
    requests.forEach((request, index) => {
      console.log(`\n--- Request ${index + 1} ---`);
      console.log(`ID: ${request._id}`);
      console.log(`User ID: ${request.userId}`);
      console.log(`Partner ID: ${request.partnerId}`);
      console.log(`Room ID: ${request.roomId}`);
      console.log(`Room Name: ${request.roomName}`);
      console.log(`Services: ${request.services}`);
      console.log(`Piece: ${request.piece}`);
      console.log(`Status: ${request.status}`);
      console.log(`Created At: ${request.createdAt}`);
    });

    // Count total requests
    const total = await LaundryRequest.countDocuments({});
    console.log(`\nTotal requests in database: ${total}`);

    // Close connection
    await mongoose.connection.close();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

listRequests();