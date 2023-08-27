const mongoose  = require("mongoose");

const SubscriptionSchema = new mongoose.Schema({
    duration:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    type:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    is_list:{
        type:Boolean,
        default:true
    }

})

module.exports = mongoose.model("subscription",SubscriptionSchema)