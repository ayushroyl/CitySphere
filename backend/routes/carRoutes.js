const express = require('express');
const axios = require('axios'); // Import axios
const router = express.Router();

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

module.exports = router;
