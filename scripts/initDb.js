import mongoose from 'mongoose';
import { Parking } from '../models/parking.js';
import { sampleParkingSpots } from '../data/sampleData.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/Parking';

async function init() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if we already have parking spots
    const count = await Parking.countDocuments();
    
    if (count === 0) {
      // Insert sample data
      await Parking.insertMany(sampleParkingSpots);
      console.log('Sample parking spots added successfully');
    } else {
      console.log(`Database already contains ${count} parking spots`);
    }

  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  } finally {
    // Close the connection
    await mongoose.disconnect();
    console.log('Database disconnected');
    process.exit(0);
  }
}

// Run the initialization
init(); 