import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../config/apiConfig";

const CarBooking = () => {
  const API_KEY = "2LZgqGuR8q4tYRamLVoY5ZONQvHpU7MF9sVjYzAZ";
  const navigate = useNavigate();
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [dropoffSuggestions, setDropoffSuggestions] = useState([]);
  const [pickupLatLng, setPickupLatLng] = useState(null);
  const [dropoffLatLng, setDropoffLatLng] = useState(null);
  const [journeyType, setJourneyType] = useState("");
  const [carType, setCarType] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [fare, setFare] = useState(null);
  const [direction, setDirection] = useState(null);

  const handleContinue = async () => {
    if (
      !pickup ||
      !dropoff ||
      !journeyType ||
      !carType ||
      !date ||
      !time ||
      !pickupLatLng ||
      !dropoffLatLng
    ) {
      console.log("Please fill all the fields and confirm locations.");
      return;
    }
    await fetchRouteInfo();
  };

  const fetchRouteInfo = async () => {
    const origin = `${pickupLatLng.lat},${pickupLatLng.lng}`;
    const destination = `${dropoffLatLng.lat},${dropoffLatLng.lng}`;

    try {
      const response = await fetch(
        `${BASE_URL}/api/cars/directions?origin=${origin}&destination=${destination}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch route data");
      }

      const RoadData = await response.json();
      const routeData = RoadData.routes[0].legs[0];

      const calculatedDistance = routeData.readable_distance;
      const travelTime = routeData.readable_duration;
      const travelTimeInMin = routeData.duration / 60;

      setDistance(calculatedDistance);
      setDuration(travelTime);

      const baseFare = 50;
      const costPerKm = 10;
      const costPerMinute = 2;

      let totalFare =
        parseInt(baseFare + calculatedDistance * costPerKm + travelTimeInMin * costPerMinute);

      if (journeyType === "Round-Trip") {
        totalFare *= 2;
      }

      if (carType === "Luxury") {
        totalFare *= 1.5;
      }

      setFare(totalFare);

      navigateToFinalCarBook(totalFare, calculatedDistance, travelTime);
    } catch (error) {
      console.error("Error fetching route info:", error);
    }
  };

  const navigateToFinalCarBook = (totalFare, distance, duration) => {
    navigate("/finalcarbook", {
      state: {
        pickup,
        dropoff,
        pickupLatLng,
        dropoffLatLng,
        journeyType,
        carType,
        date,
        time,
        distance,
        duration,
        fare: totalFare,
      },
    });
  };

  const fetchGeocodingData = async (address, setLatLng) => {
    try {
      const response = await axios.get(`https://api.olamaps.io/places/v1/geocode`, {
        params: {
          address,
          language: "en",
          api_key: API_KEY,
        },
      });

      if (response.data && response.data.geocodingResults.length > 0) {
        const { lat, lng } = response.data.geocodingResults[0].geometry.location;
        setLatLng({ lat, lng });
      } else {
        console.error("No results found for this address");
      }
    } catch (error) {
      console.error("Error fetching geocoding data:", error);
    }
  };

  const fetchSuggestions = async (query, setSuggestions) => {
    if (!query) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await axios.get(`https://api.olamaps.io/places/v1/autocomplete`, {
        params: {
          input: query,
          api_key: API_KEY,
        },
      });
      setSuggestions(response.data.predictions || []);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  const handlePickupChange = (value) => {
    setPickup(value);
    debounce(() => fetchSuggestions(value, setPickupSuggestions), 300)();
  };

  const handleDropoffChange = (value) => {
    setDropoff(value);
    debounce(() => fetchSuggestions(value, setDropoffSuggestions), 300)();
  };

  const handlePickupSelect = async (suggestion) => {
    setPickup(suggestion);
    setPickupSuggestions([]);
    await fetchGeocodingData(suggestion, setPickupLatLng);
  };

  const handleDropoffSelect = async (suggestion) => {
    setDropoff(suggestion);
    setDropoffSuggestions([]);
    await fetchGeocodingData(suggestion, setDropoffLatLng);
  };


  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="bg-white p-8 mt-14 font-medium rounded-xl shadow-lg w-full sm:w-2/3 lg:w-1/2 max-w-lg">
        {/* Pickup Location */}
        <div className="mb-4">
          <label className="block text-gray-600 mb-2">Set Pickup Location</label>
          <input
            type="text"
            placeholder="Search Pickup Location"
            value={pickup}
            onChange={(e) => handlePickupChange(e.target.value)}
            className="w-full py-3 px-4 border rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            required
          />
          {/* Pickup Suggestions */}
          {pickupSuggestions.length > 0 && (
            <div className="bg-white border rounded-lg shadow-md mt-2">
              {pickupSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    handlePickupSelect(suggestion.description);
                    setPickupSuggestions([]);
                  }}
                >
                  {suggestion.description}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drop-off Location */}
        <div className="mb-4">
          <label className="block text-gray-600 mb-2">Set Drop-off Location</label>
          <input
            type="text"
            placeholder="Search Drop Location"
            value={dropoff}
            onChange={(e) => handleDropoffChange(e.target.value)}
            className="w-full py-3 px-4 border rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          {/* Drop-off Suggestions */}
          {dropoffSuggestions.length > 0 && (
            <div className="bg-white border rounded-lg shadow-md mt-2">
              {dropoffSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    handleDropoffSelect(suggestion.description);
                    setDropoffSuggestions([]);
                  }}
                >
                  {suggestion.description}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Journey Type */}
        <div className="mb-4">
          <label className="block text-gray-600 mb-2">Journey Type</label>
          <select
            className="w-full py-3 px-4 border rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={journeyType}
            onChange={(e) => setJourneyType(e.target.value)}
          >
            <option value="">-- Select --</option>
            <option value="One-Way">One-Way</option>
            <option value="Round-Trip">Round-Trip</option>
          </select>
        </div>

        {/* Car Type */}
        <div className="mb-4">
          <label className="block text-gray-600 mb-2">Select Car</label>
          <select
            className="w-full py-3 px-4 border rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={carType}
            onChange={(e) => setCarType(e.target.value)}
          >
            <option value="">-- Select --</option>
            <option value="Economy">5-Seater</option>
            <option value="Luxury">9-Seater</option>
          </select>
        </div>

        {/* Date */}
        <div className="mb-4">
          <label className="block text-gray-600 mb-2">Journey Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full py-3 px-4 border rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>

        {/* Pickup Time */}
        <div className="mb-6">
          <label className="block text-gray-600 mb-2">Pickup Time</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full py-3 px-4 border rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-blue-500 transition duration-200"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

// Spinner CSS as an object
const spinnerStyle = {
  border: "5px solid #f3f3f3", // Light gray border
  borderTop: "5px solid #3498db", // Blue border
  borderRadius: "50%",
  width: "50px",
  height: "50px",
  animation: "spin 1s linear infinite",
};

// Add animation keyframes in style tag
const styleTag = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Inject the style tag into the document
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styleTag;
document.head.appendChild(styleSheet);

export default CarBooking;