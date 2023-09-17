const mongoose = require("mongoose")


const salesShema = new mongoose.Schema({
    resortId:{
        type:String,
        ref:"resorts",
        required:true
    },
    subscriptionId:{
        type:String,
        required:true
    },
    type:{
        type:String
    },
    price:{
        type:Number
    },
    date:{
        type:Date,
        default: new Date()
    },
    payment_id:{
        String
    }
})

module.exports = mongoose.model("Sales",salesShema)