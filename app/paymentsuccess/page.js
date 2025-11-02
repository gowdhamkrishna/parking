"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { showLastReceipt } from "@/components/server";
import { FaReceipt, FaPrint, FaDownload, FaCheck } from "react-icons/fa";
import { useSearchParams } from 'next/navigation'
const Page = () => {
  const { user } = useUser();
  const searchParams = useSearchParams()
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        setLoading(true);
         const search = searchParams.get('orderid')
         console.log(search);
        const response = await showLastReceipt(search);
        setData(response.data);
        console.log(response.data)
      } catch (error) {
        console.error("Error fetching receipt:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-4">
      <div className="bg-white shadow-xl rounded-lg w-full max-w-md overflow-hidden print:shadow-none">
        {/* Receipt Header */}
        <div className="bg-blue-600 py-6 px-6 text-white print:bg-white print:text-black">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FaReceipt className="text-2xl" />
              <h2 className="text-2xl font-bold">Payment Receipt</h2>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={handlePrint}
                className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all print:hidden"
                title="Print Receipt"
              >
                <FaPrint className="text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Receipt Body */}
        <div className="p-6">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-3">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
              <p className="text-gray-500 font-medium">Loading your receipt...</p>
            </div>
          ) : data ? (
            <div>
              {/* Success Message */}
              <div className="mb-6 flex items-center justify-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-500 mb-2">
                  <FaCheck className="text-xl" />
                </div>
              </div>
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Payment Successful</h3>
                <p className="text-sm text-gray-500">Thank you for your payment</p>
              </div>

              {/* Receipt Details */}
              <div className="border-t border-dashed border-gray-200 pt-4 mt-4">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name</span>
                    <span className="font-medium text-gray-900">{data.name}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Parking Place</span>
                    <span className="font-medium text-gray-900">{data.parkingPlace}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order ID</span>
                    <span className="font-medium text-gray-900">{data.orderid}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date & Time</span>
                    <span className="font-medium text-gray-900">
                      {new Date(data.time).toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Slot Number</span>
                    <span className="font-medium text-gray-900">{data.slot}</span>
                  </div>
                </div>
              </div>

              {/* Total Amount */}
              <div className="border-t border-dashed border-gray-200 mt-6 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-800">Total Amount</span>
                  <span className="text-xl font-bold text-blue-600">₹{data.price}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-red-500">Failed to load receipt data</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        {/* Receipt Footer */}
        {data && (
          <div className="bg-gray-50 px-6 py-4 text-center text-xs text-gray-500 print:bg-white">
            <p>This is an electronic receipt. No signature required.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
