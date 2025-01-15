const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: false, // Required only for service bookings
    },
    flatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Flat',
      required: false, // Required only for flat bookings
    },
    pickup: {
      type: String,
      required: function () {
        return this.type === 'car';
      },
    },
    dropoff: {
      type: String,
      required: function () {
        return this.type === 'car';
      },
    },
    journeyType: {
      type: String, // e.g., "One-way", "Round-trip"
      required: function () {
        return this.type === 'car';
      },
    },
    carType: {
      type: String, // e.g., "Sedan", "SUV"
      required: function () {
        return this.type === 'car';
      },
    },
    distance: {
      type: Number, // In kilometers
      required: function () {
        return this.type === 'car';
      },
    },
    duration: {
      type: String, // e.g., "2 hours"
      required: function () {
        return this.type === 'car';
      },
    },
    fare: {
      type: Number, // Total fare amount
      required: function () {
        return this.type === 'car';
      },
    },
    date: {
      type: Date,
      required: function () {
        return this.type === 'car';
      },
    },
    time: {
      type: String, // Pickup time
      required: function () {
        return this.type === 'car';
      },
    },
    address: {
      type: String,
      required: function () {
        return this.type === 'service';
      },
    },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
    type: {
      type: String,
      enum: ['service', 'flat', 'car'],
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

// Validation middleware
orderSchema.pre('save', function (next) {
  if (this.type === 'flat' && !this.flatId) {
    return next(new Error('Missing flatId for flat order'));
  }

  if (this.type === 'service' && !this.serviceId) {
    return next(new Error('Missing serviceId for service order'));
  }

  if (this.type === 'car') {
    // Ensure car booking-related fields are provided
    if (
      !this.pickup ||
      !this.dropoff ||
      !this.date ||
      !this.time ||
      !this.carType ||
      this.distance === undefined ||
      this.fare === undefined
    ) {
      return next(new Error('Missing required fields for car booking'));
    }
  }

  next();
});

module.exports = mongoose.model('Order', orderSchema);
