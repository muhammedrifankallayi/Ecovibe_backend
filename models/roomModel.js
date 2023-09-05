const mongoose = require('mongoose');

const resortRoomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: true,
    unique: true,
  },
  roomType: {
    type: String,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  pricePerNight: {
    type: Number,
    required: true,
  },
  amenities: [String], 
  available: {
    type: Boolean,
    default: true,
  },
  bookings: [
    {
      guestName: String,
      checkInDate: Date,
      checkOutDate: Date,
    },
  ],
});

const ResortRoom = mongoose.model('ResortRoom', resortRoomSchema);

module.exports = ResortRoom;
