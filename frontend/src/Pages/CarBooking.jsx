import React, { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners"; // Spinner library

const CarBooking = () => {
  const [loading, setLoading] = useState(true); // State to track loading

  useEffect(() => {
    // Simulating API confirmation and map initialization
    const loadOlaMaps = async () => {
      try {
        // Simulate an API call delay
        await new Promise((resolve) => setTimeout(resolve, 2000)); // 2 seconds delay
        // Here you would initialize Ola Maps API
        // Example: olaMaps.init({ ... });

        setLoading(false); // Set loading to false after initialization
      } catch (error) {
        console.error("Error loading Ola Maps API:", error);
      }
    };

    loadOlaMaps();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Car Booking Service</h1>

      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh" }}>
          <ClipLoader size={50} color="#3498db" />
          <p style={{ marginTop: "10px", fontSize: "16px", color: "#555" }}>
            Waiting for API confirmation from Ola Maps...
          </p>
        </div>
      ) : (
        <div>
          <div style={{ marginBottom: "40px" }}>
            <h2 style={{ textAlign: "center", marginBottom: "10px" }}>Static Map</h2>
            <div id="static-map" style={{ width: "100%", height: "400px", borderRadius: "8px", border: "1px solid #ccc" }}></div>
          </div>

          <div>
            <h2 style={{ textAlign: "center", marginBottom: "10px" }}>Interactive Map</h2>
            <div id="interactive-map" style={{ width: "100%", height: "500px", borderRadius: "8px", border: "1px solid #ccc" }}></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarBooking;
