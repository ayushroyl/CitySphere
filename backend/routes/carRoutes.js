const express = require('express');
const axios = require('axios'); // Import axios
const router = express.Router();
const FareSettings = require('../models/FareSettings');
const { adminMiddleware } = require('../middleware/authMiddleware');

// Define the GET route
router.get('/directions', async (req, res) => {
  // Get the origin and destination from query parameters
  const { origin, destination } = req.query;

  if (!origin || !destination) {
    return res.status(400).json({ error: 'Origin and destination are required' });
  }

  try {
    // Construct the URL with the query parameters and your API key
    const url = `https://api.olamaps.io/routing/v1/directions?origin=${origin}&destination=${destination}&api_key=${process.env.OLAMAPS_API_KEY}`;

    // Make the GET request to the Olamaps API using axios
    const response = await axios.post(url);

    // Send the result back to the frontend
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching directions:', error);
    res.status(500).json({ error: 'Unable to fetch directions from Olamaps' });
  }
});

// Fetch fare settings
router.get("/fare-settings", async (req, res) => {
  try {
    let settings = await FareSettings.findOne();

    // If no settings exist, return default values
    if (!settings) {
      settings = {
        baseFare: 100,
        costPerKm: 20,
        costPerMinute: 5,
        luxuryMultiplier: 1.5,
        roundTripMultiplier: 2,
      };
    }

    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching fare settings" });
  }
});

router.put("/fare-settings", adminMiddleware, async (req, res) => {
  try {
    const { baseFare, costPerKm, costPerMinute, luxuryMultiplier, roundTripMultiplier } = req.body;

    // Validate input
    if (!baseFare || !costPerKm || !costPerMinute) {
      return res.status(400).json({ message: "All fare values are required" });
    }

    let settings = await FareSettings.findOne();
    
    if (!settings) {
      settings = new FareSettings();
    }

    settings.baseFare = baseFare;
    settings.costPerKm = costPerKm;
    settings.costPerMinute = costPerMinute;
    settings.luxuryMultiplier = luxuryMultiplier;
    settings.roundTripMultiplier = roundTripMultiplier;

    await settings.save();

    res.json({ message: "Fare settings updated successfully", settings });
  } catch (error) {
    res.status(500).json({ message: "Error updating fare settings" });
  }
});



module.exports = router;
