import dotenv from 'dotenv';
import path from 'path';
import { createServer } from 'http';
import next from 'next';
import connectDB from './lib/db';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

// Create Next.js app
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(async () => {
  // Connect to MongoDB
  try {
    await connectDB();
    console.log('✅ MongoDB URI loaded: ✅');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    // Don't exit - let Next.js start anyway, connection will be retried on API calls
  }

  // Create HTTP server
  createServer(async (req, res) => {
    try {
      await handle(req, res);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  }).listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});

