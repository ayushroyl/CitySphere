const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assumes a `User` model exists
    required: true,
  },
  // serviceId is for service orders
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service', // Assumes a `Service` model exists
    required: false, // Optional, only for service orders
  },
  // flatType and associated fields for flat bookings
  flatType: {
    type: String,
    required: false, // Optional, only for flat bookings
  },
  moveInDate: {
    type: Date,
    required: false, // Optional, only for flat bookings
  },
  budget: {
    min: {
      type: Number,
      required: false, // Optional, only for flat bookings
    },
    max: {
      type: Number,
      required: false, // Optional, only for flat bookings
    },
  },
  // Fields for car booking
  pickup: {
    type: String,
    required: false, // Optional, only for car bookings
  },
  dropoff: {
    type: String,
    required: false, // Optional, only for car bookings
  },
  pickupDate: {
    type: Date,
    required: false, // Optional, only for car bookings
  },
  pickupTime: {
    type: String, // Time in HH:mm format or ISO 8601 string
    required: false, // Optional, only for car bookings
  },
  carType: {
    type: String, // e.g., "SUV", "Sedan"
    required: false, // Optional, only for car bookings
  },
  distance: {
    type: Number, // Distance in kilometers
    required: false, // Optional, only for car bookings
  },
  price: {
    type: Number, // Total price for the booking
    required: false, // Optional, only for car bookings
  },
  address: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
    default: 'Pending',
  },
  type: {
    type: String,
    enum: ['service', 'flat', 'car'], // Added 'car' for car bookings
    required: true, // Either 'service', 'flat', or 'car'
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Validation middleware
orderSchema.pre('save', function (next) {
  if (this.type === 'flat') {
    // Ensure flatType, moveInDate, and budget are provided for flat orders
    if (!this.flatType || !this.moveInDate || !this.budget) {
      return next(new Error('Missing required fields for flat booking'));
    }
  }

  if (this.type === 'service' && !this.serviceId) {
    return next(new Error('Missing serviceId for service order'));
  }

  if (this.type === 'car') {
    // Ensure car booking-related fields are provided
    if (
      !this.pickup ||
      !this.dropoff ||
      !this.pickupDate ||
      !this.pickupTime ||
      !this.carType ||
      this.distance === undefined ||
      this.price === undefined
    ) {
      return next(new Error('Missing required fields for car booking'));
    }
  }

  next();
});

module.exports = mongoose.model('Order', orderSchema);
