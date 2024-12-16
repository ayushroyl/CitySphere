{/*import React, { useEffect } from "react";
import { OlaMaps } from "../OlaMapsWebSDK/dist/olamaps-js-sdk.es"; // Adjust SDK path
import "../OlaMapsWebSDK/dist/style.css"; // Adjust CSS path

const CarBooking = () => {
  useEffect(() => {
    const initInteractiveMap = () => {
      // Initialize Ola Maps for interactive map
      const olaMaps = new OlaMaps({
        apiKey: "7uYaJXfbMImaz4iuF2Fm2To5mE", // Replace with your valid API Key
      });

      // Render interactive map
      olaMaps.init({
        style: "https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json",
        container: "interactive-map", // ID for interactive map container
        center: [77.61648476788898, 12.931423492103944], // Initial coordinates
        zoom: 15,
      });
    };

    const initStaticMap = () => {
      const staticMapUrl = `https://api.olamaps.io/tiles/v1/styles/default-light-standard/static/77.61,12.93,15/800x400.png?marker=77.61%2C12.93%7Cred%7Cscale%3A0.9&path=77.61%2C12.93%7C77.61190639293811%2C12.937637130956137%7Cwidth%3A6%7Cstroke%3A%2300ff44&api_key=your_api_key_here`;

      // Call getStaticMap to render static map
      const olaMaps = new OlaMaps({
        apiKey: "your_api_key_here",
      });
      olaMaps.getStaticMap(staticMapUrl, "static-map");
    };

    initInteractiveMap(); // Initialize interactive map
    initStaticMap(); // Render static map
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Car Booking Service</h1>

      <div style={{ marginBottom: "40px" }}>
        <h2 style={{ textAlign: "center", marginBottom: "10px" }}>Static Map</h2>
        <div id="static-map" style={{ width: "100%", height: "400px", borderRadius: "8px", border: "1px solid #ccc" }}></div>
      </div>

      <div>
        <h2 style={{ textAlign: "center", marginBottom: "10px" }}>Interactive Map</h2>
        <div id="interactive-map" style={{ width: "100%", height: "500px", borderRadius: "8px", border: "1px solid #ccc" }}></div>
      </div>
    </div>
  );
};

export default CarBooking; */}
