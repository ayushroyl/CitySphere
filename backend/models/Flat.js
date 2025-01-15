const mongoose = require('mongoose');

const flatSchema = new mongoose.Schema({
    flatName: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    photos: [{ type: String, required: true }], // Array of photo paths
}, { timestamps: true });

module.exports = mongoose.model('Flat', flatSchema);
