const mongoose = require('mongoose');

const resortRoomSchema = new mongoose.Schema({

    resort_id: {
        type: String,
        required: true
    },
    hoster_id: {
        type: String,
        required: true
    },
    rooms: [
        {

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
            amenities: {
                type: String
            },
            adults: {
                type: Number,
                required: true
            },
            childrens: {
                type: Number,
                required: true
            },
            beds:{
            type:Number,
            required:true
            },

            available: {
                type: Boolean,
                default: true,
            },
            roomCount:{
                type:Number,    
                default:0
            },
            bookings: [
                {
                    guestId: String,
                    checkInDate: Date,
                    checkOutDate: Date,
                },
            ],

        }
    ],


});

const ResortRoom = mongoose.model('ResortRoom', resortRoomSchema);

module.exports = ResortRoom;
