import React, { useState, useEffect } from "react";

const CarBooking = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating API confirmation and map initialization
    const loadOlaMaps = async () => {
      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 2000)); // 2 seconds delay
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
          {/* Spinner */}
          <div style={spinnerStyle}></div>
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
