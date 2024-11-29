import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import L from "leaflet";
import { useNavigate } from 'react-router-dom';
import BASE_URL from '../config/apiConfig';

const liveLocationIcon = new L.Icon({
  iconUrl: "path_to_live_location_icon.png", // Replace with the correct path
  iconSize: [30, 30],
});

const CarBooking = () => {
  const [pickup, setPickup] = useState({ location: null, address: "" });
  const [dropoff, setDropoff] = useState({ location: null, address: "" });
  const [pickupSearchResults, setPickupSearchResults] = useState([]);
  const [dropoffSearchResults, setDropoffSearchResults] = useState([]);
  const [selectedCar, setSelectedCar] = useState("Standard");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [distance, setDistance] = useState(0);
  const [price, setPrice] = useState(0);
  const [carLocation, setCarLocation] = useState([25.2093, 85.6365]);
  const [liveTracking, setLiveTracking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();


  const MAPTILER_API_KEY = import.meta.env.VITE_MAPTILER_API_KEY;

  useEffect(() => {
    // Fetch user details on component mount
    const fetchUserDetails = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/authpage");
        return;
      }

      try {
        const userResponse = await axios.get(`${BASE_URL}/api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = userResponse.data;

        if (!user.address) {
          setAddress("");  // Request user to fill address
        } else {
          setName(user.name);
          setMobile(user.mobile);
          setAddress(user.address);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    }

    fetchUserDetails();
  }, [navigate]);

  // Update car location dynamically for live tracking
  useEffect(() => {
    if (liveTracking) {
      const interval = setInterval(() => {
        setCarLocation((prev) => [
          prev[0] + Math.random() * 0.01 - 0.005,
          prev[1] + Math.random() * 0.01 - 0.005,
        ]);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [liveTracking]);

  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Radius of the Earth in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  const calculateDistanceAndPrice = () => {
    if (!pickup.location || !dropoff.location) return;

    const [lat1, lon1] = pickup.location;
    const [lat2, lon2] = dropoff.location;

    const calculatedDistance = haversineDistance(lat1, lon1, lat2, lon2);
    const baseRate = selectedCar === "Standard" ? 10 : selectedCar === "SUV" ? 15 : 20;
    const calculatedPrice = calculatedDistance * baseRate;

    setDistance(calculatedDistance.toFixed(2));
    setPrice(calculatedPrice.toFixed(2));
  };

  useEffect(() => {
    calculateDistanceAndPrice();
  }, [pickup.location, dropoff.location, selectedCar]);

  // Handle location search
  const handleSearch = async (query, setter, resultsSetter) => {
    if (!query) return;
    try {
      const response = await axios.get(
        `https://api.maptiler.com/geocoding/${encodeURIComponent(
          query
        )}.json?key=${MAPTILER_API_KEY}`
      );
      const results = response.data.features.map((feature) => ({
        address: feature.place_name,
        location: [feature.geometry.coordinates[1], feature.geometry.coordinates[0]],
      }));
      resultsSetter(results);
      setter((prev) => ({ ...prev, address: query }));
    } catch (error) {
      setError("Error searching for location. Please try again.");
      console.error("Error searching for location:", error);
    }
  };

  const handleSelectResult = (result, setter, resultsSetter) => {
    setter({ location: result.location, address: result.address });
    resultsSetter([]);
  };

  // Fetch user's live location
  const fetchLiveLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setPickup({
          location: [latitude, longitude],
          address: "My Location",
        });
        setError("");
      },
      (error) => {
        setError("Unable to fetch your location.");
        console.error("Error fetching live location:", error);
      }
    );
  };

  const handleBooking = async () => {
    if (!pickup|| !dropoff || !selectedCar || !pickupDate || !pickupTime) {
      alert("Please fill all the details before proceeding.");
      return;
    }

    setLoading(true);
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userData').split('"')[1];

    try {
      const response = await axios.post(
        `${BASE_URL}/api/orders/add`,
        {
          userId,
          pickup,
          dropoff,
          carType: selectedCar,
          pickupDate,
          pickupTime,
          distance,
          price,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 201) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false); // Hide success animation after 3 seconds
          setShowAddressModal(false);
          setSelectedServiceId(null);
        }, 1500);
      } else {
        alert('Failed to book car. Please try again.');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to book car. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  const LocationMarker = ({ setter }) => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setter({ location: [lat, lng], address: "Selected Location" });
      },
    });
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 my-14">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="grid lg:grid-cols-3 gap-4">
          <div className="col-span-2 my-4 mx-4">
            <MapContainer
              center={carLocation}
              zoom={13}
              scrollWheelZoom
              className="w-full h-96 rounded-lg -z-0"
            >
              <TileLayer
                url={`https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=${MAPTILER_API_KEY}`}
              />
              {pickup.location && (
                <Marker position={pickup.location} icon={liveLocationIcon}>
                  <Popup>Pickup Location</Popup>
                </Marker>
              )}
              {dropoff.location && (
                <Marker position={dropoff.location}>
                  <Popup>Dropoff Location</Popup>
                </Marker>
              )}
              {pickup.location && dropoff.location && (
                <Polyline positions={[pickup.location, dropoff.location]} color="blue" />
              )}
              <Marker position={carLocation}>
                <Popup>Car Location</Popup>
              </Marker>
              <LocationMarker setter={setPickup} />
            </MapContainer>
          </div>
          <div className="p-6 space-y-4 col-span-1">
            <div className="relative">
              <label className="block text-sm font-medium">Pickup Location</label>
              <input
                type="text"
                value={pickup.address}
                onChange={(e) => handleSearch(e.target.value, setPickup, setPickupSearchResults)}
                placeholder="Search pickup location"
                className="w-full border p-2 rounded-lg"
              />
              {pickupSearchResults.map((result, index) => (
                <div
                  key={index}
                  onClick={() => handleSelectResult(result, setPickup, setPickupSearchResults)}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {result.address}
                </div>
              ))}
            </div>
            <div className="relative">
              <label className="block text-sm font-medium">Dropoff Location</label>
              <input
                type="text"
                value={dropoff.address}
                onChange={(e) => handleSearch(e.target.value, setDropoff, setDropoffSearchResults)}
                placeholder="Search dropoff location"
                className="w-full border p-2 rounded-lg"
              />
              {dropoffSearchResults.map((result, index) => (
                <div
                  key={index}
                  onClick={() => handleSelectResult(result, setDropoff, setDropoffSearchResults)}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {result.address}
                </div>
              ))}
            </div>
            <div>
              <label className="block text-sm font-medium">Car Type</label>
              <select
                value={selectedCar}
                onChange={(e) => setSelectedCar(e.target.value)}
                className="w-full border p-2 rounded-lg"
              >
                <option value="Standard">Standard</option>
                <option value="SUV">SUV</option>
                <option value="Luxury">Luxury</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Pickup Date</label>
              <input
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                className="w-full border p-2 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Pickup Time</label>
              <input
                type="time"
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                className="w-full border p-2 rounded-lg"
              />
            </div>
            <div className="flex justify-between items-center">
              <p>
                <strong>Distance:</strong> {distance} km
              </p>
              <p>
                <strong>Price:</strong> ₹{price}
              </p>
            </div>
            <button
              onClick={handleBooking}
              className="w-full bg-blue-500 text-white p-2 rounded-lg"
            >
              Book Now
            </button>
            {isSuccess && <p className="text-green-500">Booking successful!</p>}
            {error && <p className="text-red-500">{error}</p>}
            <button
              onClick={fetchLiveLocation}
              className="w-full bg-gray-200 mt-4 p-2 rounded-lg"
            >
              Use My Location
            </button>
          </div>
        </div>
        {/* Success Animation */}
        {isSuccess && (
          <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
            <div className="w-64 h-64">
              <Lottie animationData={checkmarkAnimation} loop={false} />
            </div>
            <p className="absolute bottom-8 text-lg font-semibold text-green-500">
              Booking Confirmed!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarBooking;
