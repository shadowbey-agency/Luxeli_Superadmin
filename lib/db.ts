import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables if not already loaded
if (!process.env.MONGODB_URI) {
  dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
}

type MongooseConnection = typeof mongoose;

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
declare global {
  var mongoose: {
    conn: MongooseConnection | null;
    promise: Promise<MongooseConnection> | null;
  };
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  // Validate MONGODB_URI when function is called, not at module load time
  const MONGODB_URI = process.env.MONGODB_URI;
  
  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts) as Promise<MongooseConnection>;
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;