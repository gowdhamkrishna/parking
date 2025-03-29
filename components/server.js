"use server";
import Razorpay from "razorpay";
import Payment from "@/models/payment";
import { connect } from "@/connect";
import Receipt from "@/models/receipt";

export const initiate = async (amount, to_username, paymentform) => {
    await connect();


    var instance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,   
    });

    let options = {
        amount: Number.parseInt(amount),
        currency: "INR",
    };

    let order = await instance.orders.create(options);
    const { name, email} = paymentform;

   let  a= await Payment.create({
        oid: order.id,
        amount: amount / 100,
        to_user: to_username,
        name: Array.isArray(name) ? name.join(", ") : name,
        email: Array.isArray(email) ? email.join(", ") : email, 
    });
console.log('payment is save in the database')
    return order;
};
export const showLastReceipt = async (name) => {
    await connect();
  
    try {
      const receipt = await Receipt.findOne(
        { name:name }, // Assuming you store userId in Receipt
        { _id: 0 }  // Exclude _id field
      )
        .sort({ time: -1 }) // Get the most recent receipt
        .lean();
  
      if (!receipt) {
        return { success: false, message: "No receipts found for this user" };
      }
  
      return { success: true, data: receipt };
    } catch (error) {
      console.error("Error fetching last receipt:", error);
      return { success: false, message: "An error occurred" };
    }
  };
  