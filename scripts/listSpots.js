"use server";
import mongoose from "mongoose";
import { Parking } from "../models/parking.js";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/Parking";

export async function listParkingSpots() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Fetch all parking spots as plain objects
    const spots = await Parking.find({}).select("-__v").lean();

    if (spots.length === 0) {
      console.log("No parking spots found in the database.");
      return [];
    }

    // 🧹 Convert ObjectId and Date fields to strings
    const serializedSpots = spots.map((spot) => ({
      ...spot,
      _id: spot._id.toString(),
      createdAt: spot.createdAt ? spot.createdAt.toISOString() : null,
      updatedAt: spot.updatedAt ? spot.updatedAt.toISOString() : null,
    }));

    console.log("Parking Spots:", serializedSpots);
    return serializedSpots;
  } catch (error) {
    console.error("Error:", error);
    return [];
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}
