"use server"
import { NextResponse } from "next/server";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils";
import Payment from "@/models/payment";
import { connectDb } from "@/connect";

export const POST = async (req) => {
  await connectDb();
  let body = await req.formData();
  body = Object.fromEntries(body);

  let p = await Payment.findOne({ oid: body.razorpay_order_id });

  if (!p) {
    return NextResponse.json({ success: false, message: "Order ID not found" });
  }

 

  let isValid = validatePaymentVerification(
    {
      order_id: body.razorpay_order_id,
      payment_id: body.razorpay_payment_id,
    },
    body.razorpay_signature,
    process.env.RAZORPAY_KEY_SECRET
  );
  console.log(isValid);

  if (isValid) {
    await Payment.findOneAndUpdate(
      { oid: body.razorpay_order_id },
      { done: true },
      { new: true }
    );
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_URL}/paymentsuccess`,
      {
        status: 302, 
      }
    );
  } else {
    return NextResponse.json({
      success: false,
      message: "Payment verification failed",
    });
  }
};