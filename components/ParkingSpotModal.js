"use client";
import { useState, useEffect } from "react";
import { initiate } from "./server"; // Assuming this function calls your backend to create an order
import { useUser } from "@clerk/nextjs";
export default function SpotDetails({ spot, onClose }) {
  const { user } = useUser();
  const [bookingHours, setBookingHours] = useState(1);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // To 

  const totalPrice = spot ? spot.price * bookingHours : 0;

  useEffect(() => {
    // Load Razorpay script dynamically
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    document.body.appendChild(script);

    // Cleanup script on unmount
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    if (!razorpayLoaded) {
      alert("Payment gateway is still loading, please try again.");
      return;
    }

    if (!user || !user.fullName || !user.primaryEmailAddress.emailAddress) {
      alert("Please log in to proceed with the payment.");
      return;
    }

    setIsProcessing(true); // Start loading state

    try {
      // Call your initiate function to create an order on the server
      const response = await initiate(totalPrice * 100, "ParkingSpot", {
        name: user.fullName,
        email: user.primaryEmailAddress.emailAddress,
      });

      if (!response || !response.id) {
        alert("Error: No order ID returned from the server.");
        return;
      }
      const params = new URLSearchParams({
        spotName: spot.name,
        address: spot.address,
        price: spot.price,
        totalSpots: spot.totalSpots,
        availableSpots: spot.availableSpots,
        amenities: spot.amenities,
        bookingHours: bookingHours,
        selectedDate: selectedDate,
      }).toString();
      const orderId = response.id;
      console.log(spot);
      
      // Razorpay payment options
      const options = {
        key: process.env.NEXT_PUBLIC_KEY_ID, // Ensure your Razorpay key is set correctly in environment variables
        amount: totalPrice * 100, // Convert to paise (1 INR = 100 paise)
        currency: "INR",
        name: user.fullName,
        description: "Payment Transaction for Parking Spot",
        image: "https://example.com/your_logo",
        callback_url: `${process.env.NEXT_PUBLIC_URL}/api/razorpay?${params}`,
        order_id: orderId,
        prefill: {
          name: user.fullName,
          email: user.primaryEmailAddress.emailAddress,
          contact: user.contact || "8678687686", // Ensure contact field exists
        },
        notes: {
          address: "Virtual Address",
      
        },
        theme: {
          color: "#000000", // Customize the Razorpay button color
        },
      };

      const rzp1 = new Razorpay(options);

      rzp1.on("payment.failed", async function (response) {
        console.error("Payment failed:", response);
        alert("Payment failed. Please try again.");
      });

      rzp1.on("payment.success")

      rzp1.open();
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while processing the payment. Please try again.");
    } finally {
      setIsProcessing(false); // End loading state
    }
  };

  if (!spot) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full overflow-hidden">
        <div className="bg-blue-600 text-white p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">{spot.name}</h2>
              <p className="mt-2 opacity-90">{spot.address}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-200 transition-colors"
              aria-label="Close"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500">Available Spots</div>
              <div className="text-xl font-semibold text-gray-900">
                {spot.availableSpots}/{spot.totalSpots}
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500">Price per Hour</div>
              <div className="text-xl font-semibold text-gray-900">
                ₹{spot.price}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-black text-lg font-semibold mb-3">Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {spot.amenities?.map((amenity, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                >
                  {amenity}
                </span>
              ))}
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg  text-gray-600 font-semibold mb-4">Book Your Spot</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Date
                </label>
                <input
                  type="date"
                  
                  min={new Date().toISOString().split("T")[0]}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full text-black p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (hours)
                </label>
                <select
                  value={bookingHours}
                  onChange={(e) => setBookingHours(Number(e.target.value))}
                  className="w-full   text-black p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {[...Array(12).keys()].map((hour) => (
                    <option key={hour + 1} value={hour + 1}>
                      {hour + 1} {hour + 1 === 1 ? "hour" : "hours"}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Total Amount</span>
                  <span className=" text-black font-medium">₹{totalPrice}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 border-t flex justify-end space-x-4">
          <button onClick={onClose} className="text-black">
            Cancel
          </button>
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="bg-blue-600 text-gray-600 px-6 py-2 rounded-md disabled:opacity-50"
          >
            {isProcessing ? "Processing..." : "Pay Now"}
          </button>
        </div>
      </div>
    </div>
  );
}
