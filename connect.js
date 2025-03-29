import mongoose from "mongoose";

export const connect = async () => {
    try {
        // If already connected, return the existing connection
        if (mongoose.connections[0].readyState) {
            return;
        }
        
        // Connect only if not already connected
        await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/Parking");
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        throw error;
    }
}