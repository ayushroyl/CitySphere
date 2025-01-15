import React, { useEffect, useState } from "react";
import axios from "axios";
import Lottie from "lottie-react";
import checkmarkAnimation from "../assets/checkmark.json";
import { useLocation, useNavigate } from "react-router-dom";
import { OlaMaps } from "../OlaMapsWebSDK";
import BASE_URL from "../config/apiConfig";

const FinalCarBook = () => {
  const API_KEY = "2LZgqGuR8q4tYRamLVoY5ZONQvHpU7MF9sVjYzAZ"; // API Key for Ola Maps
  const location = useLocation();
  const navigate = useNavigate();

  const {
    pickup,
    dropoff,
    pickupLatLng,
    dropoffLatLng,
    distance,
    duration,
    fare,
    journeyType,
    carType,
    date,
    time,
  } = location.state || {};

  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Fetch route coordinates
  useEffect(() => {
    const fetchRouteCoordinates = async () => {
      const origin = `${pickupLatLng.lat},${pickupLatLng.lng}`;
      const destination = `${dropoffLatLng.lat},${dropoffLatLng.lng}`;

      try {
        const response = await fetch(
          `${BASE_URL}/api/cars/directions?origin=${origin}&destination=${destination}`
        );

        if (!response.ok) throw new Error("Failed to fetch route data");

        const roadData = await response.json();
        const routeSteps = roadData.routes[0]?.legs[0]?.steps;

        if (routeSteps && routeSteps.length > 0) {
          const coordinates = routeSteps.map((step) => [
            step.start_location.lng,
            step.start_location.lat,
          ]);
          coordinates.push([
            routeSteps[routeSteps.length - 1]?.end_location.lng,
            routeSteps[routeSteps.length - 1]?.end_location.lat,
          ]);
          setRouteCoordinates(coordinates);
        } else {
          console.log("Invalid route data.");
        }
      } catch (error) {
        console.error("Error fetching route data:", error);
      }
    };

    fetchRouteCoordinates();
  }, [pickupLatLng, dropoffLatLng]);

  // Initialize Map and Route
  useEffect(() => {
    let mapInstance = null;

    const initializeMap = () => {
      const olaMaps = new OlaMaps({ apiKey: API_KEY });

      mapInstance = olaMaps.init({
        style: "https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json",
        container: "map",
        center: [pickupLatLng.lng, pickupLatLng.lat],
        zoom: 12,
      });

      if (routeCoordinates.length > 0) {
        mapInstance.on("load", () => {
          mapInstance.addSource("route", {
            type: "geojson",
            data: {
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: routeCoordinates,
              },
            },
          });

          mapInstance.addLayer({
            id: "route",
            type: "line",
            source: "route",
            paint: {
              "line-color": "#007bff",
              "line-width": 4,
            },
          });
        });
      }
    };

    if (pickupLatLng && dropoffLatLng && routeCoordinates.length > 0) initializeMap();

    return () => {
      if (mapInstance) mapInstance.remove();
    };
  }, [pickupLatLng, dropoffLatLng, routeCoordinates]);

  //Confirm Booking
  const confirmBooking = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userData").split('"')[1];
    if (!token) {
      navigate("/authpage");
      return;
    }

    if (!pickup || !dropoff || !journeyType || !carType || !distance || !duration || !fare || !date || !time) {
      console.log("Missing required fields to confirm booking.");
      return;
    }

    try {
      setIsProcessing(true);

      // API call to backend
      const response = await axios.post(
        `${BASE_URL}/api/orders/add`,
        {
          pickup,
          dropoff,
          journeyType,
          carType,
          distance,
          duration,
          fare,
          date,
          time,
          userId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 201) {
        // Successfully booked
        setIsProcessing(false);
        setIsSuccess(true);

        setTimeout(() => {
          navigate("/myorder"); // Navigate to the /myorder page
        }, 2000);
      } else {
        console.log("Failed to book your order. Please try again.");
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Error during booking:", error);
      console.log("There was an error processing your booking. Please try again later.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen mt-16 bg-gray-100 flex flex-col items-center justify-center">
      <div className="bg-white rounded-lg shadow-md w-full sm:w-2/3 lg:w-1/2 max-w-lg p-6">
        {/* Map Container */}
        <div id="map" className="h-64 bg-gray-200 rounded-md shadow-sm mb-6"></div>

        {/* Trip Details */}
        <div className="bg-gray-50 p-4 rounded-md shadow-sm mb-6">
          <h2 className="text-lg font-bold mb-2">Trip Summary</h2>
          <p><strong>Pickup Location:</strong> {pickup}</p>
          <p><strong>Dropoff Location:</strong> {dropoff}</p>
          <p><strong>Journey Type:</strong> {journeyType}</p>
          <p><strong>Car Type:</strong> {carType}</p>
          <p><strong>Distance:</strong> {distance} KM</p>
          <p><strong>Duration:</strong> {duration}</p>
          <p><strong>Total Fare:</strong> ₹{fare}/-</p>
        </div>

        {/* Confirm Booking Button */}
        <button
          onClick={() => setShowConfirmModal(true)}
          className="w-full mb-5 font-medium bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
        >
          Proceed to Confirm
        </button>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-md shadow-md p-6 w-80">
            <h3 className="text-lg font-bold mb-4">Confirm Booking</h3>
            <p>Are you sure you want to book this trip?</p>
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="bg-gray-600 text-white py-2 px-4 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={confirmBooking}
                className="bg-green-600 text-white py-2 px-4 rounded-md"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {isProcessing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
            <p className="text-white mt-4 text-lg">Processing your booking...</p>
          </div>
        </div>
      )}

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
  );
};

export default FinalCarBook;
