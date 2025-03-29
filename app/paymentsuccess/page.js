"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { showLastReceipt } from "@/components/server";

const Page = () => {
  const { user } = useUser();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const response = await showLastReceipt(user.fullName);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching receipt:", error);
      }
    };

    fetchData();
  }, [user]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-4">
      <div className="bg-white shadow-2xl rounded-xl p-8 w-full max-w-md border border-gray-100">
        <div className="flex items-center justify-center mb-6">
          <h2 className="text-3xl font-bold text-blue-600">
            Payment Success
          </h2>
        </div>

        {data ? (
          <div className="space-y-4">
            <div className="border-b border-gray-100 pb-4 mb-4">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-green-100 rounded-full p-3">
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { label: "Name", value: data.name },
                { label: "Parking Place", value: data.parkingPlace },
                { label: "Order ID", value: data.orderid },
                { label: "Date & Time", value: new Date(data.time).toLocaleString() },
                { label: "Slot Number", value: data.slot },
                { label: "Amount Paid", value: `₹${data.price}` }
              ].map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2 px-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <span className="text-gray-600 font-medium">{item.label}</span>
                  <span className="text-gray-800">{item.value}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">Thank you for using our parking service!</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading receipt...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
