const mongoose  =require("mongoose");


const resortSchema = new mongoose.Schema({
    resortName : {
        type:String,
        required:true
    },
    resortAdress:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    hoster_id:{
        type:String,
        required:true
    },
    resort_type:{
        type:String,
        required:true
    },
    amenities:[
        {
            name: {
              type: String,
              required: true
            },
            description: {
              type: String
            }
          }
    ],
    occupency:{
        type:Number,
        required:true
    },

   
   
})