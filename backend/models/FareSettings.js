const mongoose = require("mongoose");

const fareSchema = new mongoose.Schema({
  baseFare: { type: Number, default: 100 },
  costPerKm: { type: Number, default: 20 },
  costPerMinute: { type: Number, default: 5 },
  luxuryMultiplier: { type: Number, default: 1.5 },
  roundTripMultiplier: { type: Number, default: 2 },
});

module.exports = mongoose.model("FareSettings", fareSchema);
