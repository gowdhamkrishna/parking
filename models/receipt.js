"use server"
import mongoose from "mongoose";

const receiptSchema = new mongoose.Schema({

  name: { type: String, required: true },
  parkingPlace: {
    type: String,
    required: true
  },
  orderid: {
    type: String,
    required: true
  },
  address:{required: true,type:String},
  time: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now
  },
  slot:{
    type:Number,
    required:true
  },
  price: {
    type: Number,
    required: true
  }
});

const Receipt = mongoose.models.Receipt || mongoose.model("Receipt", receiptSchema);
export default Receipt;
