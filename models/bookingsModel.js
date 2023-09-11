const mongoose = require("mongoose");



const bookingSchema = new mongoose.Schema({
    user_id:{
        type:String,
        required:true
    },
    resoert_id:{
        type:String,
        required:true
    },
    room_id:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    mobile:{
        type:Number,
        required:true
    },
    placed:{
type:Boolean,
default:false
    },
    payment_id:{
        type:String,

    }
})

module.exports = mongoose.model("bookings",bookingSchema)