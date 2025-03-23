"use server";
import mongoose from "mongoose";
import { Parking } from "../models/parking.js";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/Parking";

export async function listParkingSpots() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Fetch all parking spots
    const spots = await Parking.find({}).select("-__v").lean();

    if (spots.length === 0) {
      console.log("No parking spots found in the database.");
      return [];
    }

    console.log("Parking Spots:", spots);

    return spots; // Return the raw array, not JSON.stringify(spots)
  } catch (error) {
    console.error("Error:", error);
    return [];
  } finally {
    // Close the MongoDB connection properly
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}
