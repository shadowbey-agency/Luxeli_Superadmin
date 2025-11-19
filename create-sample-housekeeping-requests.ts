import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { HousekeepingRequest } from './models/housekeeping/HousekeepingRequest.ts';

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/luxeli');
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Sample items with images
const sampleItems = [
  {
    name: "Extra Towels",
    description: "Soft cotton towels for your comfort",
    image: "https://images.unsplash.com/photo-1522036935850-99b38b09b1b4?w=400&h=400&fit=crop"
  },
  {
    name: "Toilet Paper",
    description: "Premium quality toilet paper",
    image: "https://images.unsplash.com/photo-1600417764295-332c5d3c4d9d?w=400&h=400&fit=crop"
  },
  {
    name: "Shampoo",
    description: "Organic shampoo for all hair types",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop"
  },
  {
    name: "Conditioner",
    description: "Moisturizing conditioner for smooth hair",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop"
  },
  {
    name: "Body Wash",
    description: "Refreshing body wash with natural ingredients",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop"
  },
  {
    name: "Pillow",
    description: "Extra pillow for your comfort",
    image: "https://images.unsplash.com/photo-1522036935850-99b38b09b1b4?w=400&h=400&fit=crop"
  },
  {
    name: "Blanket",
    description: "Warm blanket for cozy nights",
    image: "https://images.unsplash.com/photo-1522036935850-99b38b09b1b4?w=400&h=400&fit=crop"
  },
  {
    name: "Slippers",
    description: "Comfortable hotel slippers",
    image: "https://images.unsplash.com/photo-1522036935850-99b38b09b1b4?w=400&h=400&fit=crop"
  },
  {
    name: "Toothbrush",
    description: "Soft bristle toothbrush",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop"
  },
  {
    name: "Toothpaste",
    description: "Mint-flavored toothpaste",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop"
  }
];

// Create sample housekeeping requests
const createSampleRequests = async () => {
  try {
    await connectDB();

    // Create 10 sample requests
    for (let i = 0; i < 10; i++) {
      const item = sampleItems[i];
      
      const request = new HousekeepingRequest({
        partnerId: "sample-partner-id", // This would be a real partner ID in production
        roomId: `room-${Math.floor(Math.random() * 100) + 1}`,
        roomName: `Room ${Math.floor(Math.random() * 100) + 1}`,
        guest: {
          name: `Guest ${Math.floor(Math.random() * 100) + 1}`,
          email: `guest${Math.floor(Math.random() * 100) + 1}@example.com`
        },
        type: "item needed",
        itemQuantity: Math.floor(Math.random() * 5) + 1,
        itemImage: item.image,
        deliveryDetail: {
          deliveryMethod: "Standard Delivery",
          deliveryWindow: `${Math.floor(Math.random() * 12) + 1}:00 PM - ${Math.floor(Math.random() * 12) + 2}:00 PM`
        },
        requestedFor: item.name,
        status: "new",
        priority: ["low", "medium", "urgent"][Math.floor(Math.random() * 3)],
        notes: item.description
      });

      await request.save();
      console.log(`Created request: ${item.name}`);
    }

    console.log('Successfully created 10 sample housekeeping requests');
    process.exit(0);
  } catch (error) {
    console.error('Error creating sample requests:', error);
    process.exit(1);
  }
};

// Run the script
createSampleRequests();