const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema(
  {
    foodName: {
      type: String,
      required: [true, 'Food name is required'],
      trim: true,
    },
    quantity: {
      type: String,
      required: [true, 'Quantity is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    expiryDate: {
      type: Date,
      required: [true, 'Expiry date is required'],
    },
    location: {
      type: String,
      required: [true, 'Location address is required'],
      trim: true,
    },
    latitude: {
      type: Number,
      required: [true, 'Latitude is required'],
      default: 28.6139,
    },
    longitude: {
      type: Number,
      required: [true, 'Longitude is required'],
      default: 77.2090,
    },
    image: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Available', 'Claimed'],
      default: 'Available',
    },
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Food', foodSchema);
