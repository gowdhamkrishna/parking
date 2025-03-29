"use server";
import { NextResponse } from "next/server";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils";
import Payment from "@/models/payment";
import { connect } from "@/connect";
import Receipt from "@/models/receipt";

export const POST = async (req) => {
  try {
    await connect();

    const { searchParams } = new URL(req.url);
    const body = await req.json();
    console.log(body);
    

    // Retrieve query parameters safely
    const name = searchParams.get("name") || "Unknown";
    const serviceCategory = searchParams.get("serviceCategory") || "Default";
    const startingPrice = Number(searchParams.get("startingPrice")) || 0;

    // Find the payment record
    console.log(body.razorpay_order_id);
    
    const payment = await Payment.findOne({ oid: body.razorpay_order_id });

    if (!payment) {
      return NextResponse.json({ success: false, message: "Order ID not found" });
    }

    // Verify Razorpay Payment
    const isValid = validatePaymentVerification(
      {
        order_id: body.razorpay_order_id,
        payment_id: body.razorpay_payment_id,
      },
      body.razorpay_signature,
      process.env.RAZORPAY_KEY_SECRET
    );

    if (!isValid) {
      return NextResponse.json({ success: false, message: "Payment verification failed" });
    }

    // Mark payment as completed
    await Payment.findOneAndUpdate(
      { oid: body.razorpay_order_id },
      { done: true },
      { new: true }
    );

    // Create a receipt
    await Receipt.create({
      name,
      ServiceCategory: serviceCategory,
      ServicePerson: name,
      Payment: startingPrice,
      orderid: payment.oid,
    });

    // Redirect to success page
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_URL}/paymentsuccess?orderid=${payment.oid}`,
      { status: 302 }
    );
  } catch (error) {
    console.error("Payment Processing Error:", error);
    return NextResponse.json({ success: false, message: "An error occurred" });
  }
};
