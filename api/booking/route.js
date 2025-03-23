"use server"
export async function POST(req) {
    const body=req.body()
    const {parkingId,bookingDate,duration,startTime,endTime,amount,email,contact}=body;
    console.log(body);}