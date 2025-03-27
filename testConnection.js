import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Resolve the directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ 
  path: path.resolve(__dirname, '.env'),
  override: true  // This ensures .env values take precedence
});

import mongoose from 'mongoose';
import { connectDB } from './src/lib/db.js';

async function testConnection() {
  console.log('MONGO_URI:', process.env.MONGO_URI);

  try {
    // Attempt to connect to MongoDB
    await connectDB();
    console.log('🟢 Connection Test Successful!');
    
    // Optional: Get database information
    const db = mongoose.connection;
    const collections = await db.db.listCollections().toArray();
    console.log('📋 Existing Collections:', 
      collections.map(c => c.name).join(', '));
    
    // Close the connection after testing
    await mongoose.connection.close();
  } catch (error) {
    console.error('🔴 Connection Test Failed:', error);
    console.error('Detailed Error:', error.message);
  }
}

// Run the test
testConnection();