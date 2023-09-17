const mongoose = require("mongoose")

const resortSalesSchema = new mongoose.Schema({
    resort_id:{
        type:String,
        required:true
    },
    userId:{
        type:String,
        required:true
    },
    roomId:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    date:{
        type:Date,
        default: new Date()
    }
})

module.exports = mongoose.model("resortsales",resortSalesSchema)