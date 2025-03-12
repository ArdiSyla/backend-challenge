import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// MongoDB connection URI
const uri = process.env.MONGODB_URI;

// Create a MongoDB client
const client = new MongoClient(uri);

// Connect to MongoDB
let db;
export async function connectToDatabase() {
  if (db) return db; // Return cached connection if available

  try {
    await client.connect();
    db = client.db('workspace_logs'); // Use the database name
    console.log('Connected to MongoDB');
    return db;
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }
}