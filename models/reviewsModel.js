const mongoose = require("mongoose")

const reviewSchema = new mongoose.Schema({
    user_id:{
        type:String,
        ref:"Users"
    },
    resort_id:{
        type:String
    },
    comment:{
        type:String
    },
    rating:{
        type:Number
    },
    replay:{
        type:Array
    },
    date:{
        type:Date,
        default: new Date()
    }
})

module.exports = mongoose.model("reviews",reviewSchema)