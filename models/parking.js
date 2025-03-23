import mongoose from "mongoose";

const parkingSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  address: { type: String, required: true, trim: true },
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], required: true }, 
  },
  totalSpots: { type: Number, required: true, min: 1 },
  availableSpots: { type: Number, required: true, min: 0 },
  price: { type: Number, required: true, min: 0 },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  images: { type: [String], default: [] },
  amenities: { type: [String], default: [] },
  operatingHours: {
    open: { type: String, required: true },
    close: { type: String, required: true },
  },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Create a 2dsphere index for geospatial queries
parkingSchema.index({ location: "2dsphere" });

// Auto-update `updatedAt` before saving
parkingSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Create the model
const Parking = mongoose.models.Parking || mongoose.model("Parking", parkingSchema); 

export { Parking };
