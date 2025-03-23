"use server";
import Razorpay from "razorpay";
import Payment from "@/models/payment"; // Fix: Use uppercase "P" for consistency
import { connectDb } from "@/connect";

export const initiate = async (amount, to_username, paymentform) => {
    await connectDb();


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
