import React, { useState, useEffect } from "react";
import axios from "axios";
import BASE_URL from "../config/apiConfig";

const CarSettings = () => {
  const [fareSettings, setFareSettings] = useState({
    baseFare: 100,
    costPerKm: 20,
    costPerMinute: 5,
    luxuryMultiplier: 1.5,
    roundTripMultiplier: 2,
  });

  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (snackbar.open) {
      const timer = setTimeout(() => {
        setSnackbar({ ...snackbar, open: false });
      }, 3000); // Auto-hide after 3 seconds
  
      return () => clearTimeout(timer);
    }
  }, [snackbar.open]);
  

  useEffect(() => {
    if (!token) {
      navigate("/accesslogin");
      return;
    }
    const fetchFareSettings = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/cars/fare-settings`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFareSettings(response.data);
      } catch (error) {
        setSnackbar({ open: true, message: "Failed to load settings", severity: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchFareSettings();
  }, []);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFareSettings((prev) => ({
      ...prev,
      [name]: parseFloat(value) || 0,
    }));
  };

  const handleSliderChange = (name) => (e) => {
    setFareSettings((prev) => ({ ...prev, [name]: parseFloat(e.target.value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`${BASE_URL}/api/cars/fare-settings`, fareSettings, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSnackbar({ open: true, message: "Settings saved!", severity: "success" });
    } catch (error) {
      setSnackbar({ open: true, message: "Save failed", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const estimatedFare = (
    fareSettings.baseFare +
    10 * fareSettings.costPerKm +
    20 * fareSettings.costPerMinute
  ).toFixed(2);
  if (loading && !Object.keys(fareSettings).length) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-900 to-blue-700">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
      </div>
    );
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-900 to-blue-700 p-6">
      <div className="w-full font-bold max-w-lg rounded-2xl bg-white bg-opacity-90 p-6 shadow-xl backdrop-blur-md">
        <h2 className="mb-4 text-center text-xl font-bold text-blue-900 tracking-wide">
          Fare Settings
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Input Fields */}
          {[
            { label: "Base Fare (₹)", name: "baseFare" },
            { label: "Cost Per Km (₹)", name: "costPerKm" },
            { label: "Cost Per Minute (₹)", name: "costPerMinute" },
          ].map(({ label, name }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-600">{label}</label>
              <input
                type="number"
                name={name}
                value={fareSettings[name]}
                onChange={handleInputChange}
                className="mt-1 w-full rounded-lg border-gray-300 bg-gray-100 px-4 py-2 focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
          ))}

          {/* Sliders */}
          {[
            { label: "Luxury Multiplier", name: "luxuryMultiplier", min: 1, max: 3, step: 0.1 },
            { label: "Round Trip Multiplier", name: "roundTripMultiplier", min: 1, max: 5, step: 0.5 },
          ].map(({ label, name, min, max, step }) => (
            <div key={name} className="mt-3">
              <label className="block text-sm font-medium text-gray-600">
                {label}: {fareSettings[name]}x
              </label>
              <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={fareSettings[name]}
                onChange={handleSliderChange(name)}
                className="w-full"
              />
            </div>
          ))}

          {/* Fare Preview */}
          <div className="flex flex-col items-center justify-center rounded-lg bg-gray-200 p-4">
            <p className="text-sm text-gray-600">Estimated Fare (10km, 20min)</p>
            <p className="mt-1 text-2xl font-bold text-blue-900">₹{estimatedFare}</p>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => setFareSettings({
                baseFare: 100,
                costPerKm: 20,
                costPerMinute: 5,
                luxuryMultiplier: 1.5,
                roundTripMultiplier: 2,
              })}
              className="rounded-lg border border-blue-700 px-4 py-2 font-semibold text-blue-700 hover:bg-blue-50"
            >
              Reset to Default
            </button>

            <button
              type="submit"
              className="flex items-center rounded-lg bg-blue-700 px-4 py-2 font-semibold text-white hover:bg-blue-800"
              disabled={loading}
            >
              {loading && <span className="mr-2 h-4 w-4 animate-spin border-2 border-white border-t-transparent rounded-full"></span>}
              Save
            </button>
          </div>
        </form>
      </div>

      {/* Snackbar Notification */}
      {snackbar.open && (
        <div
          className={`fixed z-10 font-bold bottom-5 left-1/2 -translate-x-1/2 rounded-lg px-4 py-2 text-white shadow-lg transition-opacity duration-500 ${snackbar.severity === "success" ? "bg-green-500" : "bg-red-500"
            }`}
        >
          {snackbar.message}
        </div>
      )}

    </div>
  );
};

export default CarSettings;
