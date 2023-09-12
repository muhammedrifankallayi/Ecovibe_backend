const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    user_id:{
        type:String,
        required:true
    },
    notification:[
        {
            text:{
                type:String
            },
            date:{
                type:Date,
                default:new Date()
            },
            is_view:{
                type:Boolean,
                default:false
            },
            redirection:{
                type:String
            }
        }
    ],
   
   

})

module.exports = mongoose.model("notification",notificationSchema)