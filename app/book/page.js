"use client"
import { useUser, useAuth } from "@clerk/nextjs";
import {listParkingSpots} from '../../scripts/listSpots'
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import SpotDetails from "@/components/ParkingSpotModal";

export default function BookPage() {
  const { user, isLoaded } = useUser();
  const { userId, sessionId } = useAuth();
  const router = useRouter();
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [parkingSpots, setParkingSpots] = useState([]);
  const [error, setError] = useState(null);
  const [selectedSpot, setSelectedSpot] = useState(null);

  useEffect(() => {
    getDetails()
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location)
          setLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setError("Unable to get your location. Please enable location services.");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      console.log('Auth state:', { userId, sessionId });
    }
  }, [isLoaded, userId, sessionId]);

  const getDetails = async () => {
    const data = await listParkingSpots();
    setParkingSpots(data)
  }

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to book parking</h2>
          <a href="/login" className="text-blue-600 hover:text-blue-700">Sign in</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {user.firstName}!
              </h1>
              <p className="text-gray-600 mt-1">
                Find and book your parking spot
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Current Location</p>
              <p className="text-sm font-medium text-gray-900">
                {userLocation ? "Location detected" : "Location not available"}
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Available Spots Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Available Parking Spots</h2>
          
          {parkingSpots.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <p className="text-gray-600">No parking spots available in your area.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {parkingSpots.map((spot, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="relative h-48">
                    <Image
                      src={`/${spot.images[0]}`}
                      alt={spot.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-sm">
                      {spot.availableSpots} spots left
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900">{spot.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{spot.address}</p>
                    
                    {/* Amenities */}
                    <div className="mt-2 flex flex-wrap gap-2">
                      {spot.amenities.map((amenity, index) => (
                        <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {amenity}
                        </span>
                      ))}
                    </div>

                    {/* Operating Hours */}
                    <div className="mt-2 text-sm text-gray-600">
                      Open: {spot.operatingHours.open} - {spot.operatingHours.close}
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-yellow-400">★</span>
                        <span className="text-sm text-gray-600">{spot.rating}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {spot.distance ? `${spot.distance} km away` : 'Distance unknown'}
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-lg font-bold text-gray-900">
                        ₹{spot.price}/hour
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSpot(spot);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Map Section */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Parking Map</h2>
          <div className="h-96 bg-gray-200 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Map integration coming soon</p>
          </div>
        </div>
      </div>

      {/* Show SpotDetails modal when a spot is selected */}
      {selectedSpot && (
        <SpotDetails
          spot={selectedSpot}
          onClose={() => setSelectedSpot(null)}
        />
      )}
    </div>
  );
}