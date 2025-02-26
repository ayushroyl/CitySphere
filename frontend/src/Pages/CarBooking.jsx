import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../config/apiConfig";
import { motion, AnimatePresence } from "framer-motion";
import { FaMapMarkerAlt } from "react-icons/fa";

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
  const [minTime, setMinTime] = useState("");
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [fare, setFare] = useState(null);
  const [direction, setDirection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fareSettings, setFareSettings] = useState(null);

  useEffect(() => {
    const fetchFareSettings = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/cars/fare-settings`);
        setFareSettings(response.data);
      } catch (error) {
        console.error("Error fetching fare settings:", error);
      }
    };

    fetchFareSettings();
  }, []);


  useEffect(() => {
    // Set the minimum date to today
    const today = new Date().toISOString().split("T")[0];
    setDate(today);
  }, []);

  useEffect(() => {
    if (date === new Date().toISOString().split("T")[0]) {
      // If today is selected, restrict time to current time
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      setMinTime(`${hours}:${minutes}`);
    } else {
      setMinTime("00:00"); // If future date is selected, allow any time
    }
  }, [date]);

  const fetchRouteInfo = async () => {
    if (!fareSettings) {
      console.error("Fare settings not loaded yet.");
      return;
    }
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

      // Use dynamic fare settings
      const baseFare = fareSettings.baseFare;
      const costPerKm = fareSettings.costPerKm;
      const costPerMinute = fareSettings.costPerMinute;
      const luxuryMultiplier = fareSettings.luxuryMultiplier;
      const roundTripMultiplier = fareSettings.roundTripMultiplier;

      let totalFare =
        baseFare + calculatedDistance * costPerKm + travelTimeInMin * costPerMinute;

      if (journeyType === "Round-Trip") {
        totalFare *= roundTripMultiplier;
      }

      if (carType === "Luxury") {
        totalFare *= luxuryMultiplier;
      }
      
      totalFare = Math.ceil(totalFare);
      setFare(totalFare);

      navigateToFinalCarBook(totalFare, calculatedDistance, travelTime);
    } catch (error) {
      console.error("Error fetching route info:", error);
      setLoading(false);
    }
  };

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
    setLoading(true);
    await fetchRouteInfo();
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col items-center p-6 bg-gradient-to-br from-blue-400 to-purple-600"
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120 }}
        className="bg-white/80 backdrop-blur-lg p-8 mt-14 mb-10 rounded-2xl shadow-2xl w-full sm:w-2/3 lg:w-1/2 max-w-lg border border-gray-200"
      >
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          Book Your Ride
        </h2>

        {/* Pickup Location */}
        <div className="mb-5 relative">
          <label className="block text-gray-700 font-medium mb-2">Set Pickup Location</label>
          <div className="relative">
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="text"
              placeholder="Search Pickup Location"
              value={pickup}
              onChange={(e) => handlePickupChange(e.target.value)}
              className="w-full py-3 pl-12 pr-4 font-medium border rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            />
            <FaMapMarkerAlt className="absolute left-4 top-3 text-blue-500" />
          </div>
          <AnimatePresence>
            {pickupSuggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute w-full bg-white border rounded-lg shadow-lg mt-2 z-50"
              >
                {pickupSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 font-medium cursor-pointer hover:bg-gray-100 transition duration-200"
                    onClick={() => {
                      handlePickupSelect(suggestion.description);
                      setPickupSuggestions([]);
                    }}
                  >
                    {suggestion.description}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Drop-off Location */}
        <div className="mb-5 relative">
          <label className="block text-gray-700 font-medium mb-2">Set Drop-off Location</label>
          <div className="relative">
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="text"
              placeholder="Search Drop-off Location"
              value={dropoff}
              onChange={(e) => handleDropoffChange(e.target.value)}
              className="w-full py-3 pl-12 pr-4 font-medium border rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            />
            <FaMapMarkerAlt className="absolute left-4 top-3 text-red-500" />
          </div>
          <AnimatePresence>
            {dropoffSuggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute w-full bg-white border rounded-lg shadow-lg mt-2 z-50"
              >
                {dropoffSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 font-medium cursor-pointer hover:bg-gray-100 transition duration-200"
                    onClick={() => {
                      handleDropoffSelect(suggestion.description);
                      setDropoffSuggestions([]);
                    }}
                  >
                    {suggestion.description}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Journey Type & Car Type*/}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Journey Type</label>
            <motion.select
              whileFocus={{ scale: 1.02 }}
              value={journeyType}
              onChange={(e) => setJourneyType(e.target.value)}
              className="w-full py-3 px-4 font-medium border rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            >
              <option value="">-- Select --</option>
              <option value="One-Way">One-Way</option>
              <option value="Round-Trip">Round-Trip</option>
            </motion.select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Select Car</label>
            <motion.select
              whileFocus={{ scale: 1.02 }}
              value={carType}
              onChange={(e) => setCarType(e.target.value)}
              className="w-full py-3 px-4 font-medium border rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            >
              <option value="">-- Select --</option>
              <option value="Economy">5-Seater</option>
              <option value="Luxury">7-Seater</option>
            </motion.select>
          </div>
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Select Date</label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="date"
              min={new Date().toISOString().split("T")[0]}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full py-3 px-4 font-medium border rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Pickup Time</label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="time"
              min={minTime}
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full py-3 px-4 font-medium border rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            />
          </div>
        </div>


        {/* Continue Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleContinue}
          className={`w-full bg-blue-600 text-white py-3 font-medium rounded-full shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 ${loading ? "cursor-not-allowed" : "hover:bg-blue-700"
            }`}
          disabled={loading}
        >
          {loading ? "Processing..." : "Continue"}
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default CarBooking;