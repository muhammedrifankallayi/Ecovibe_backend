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
    mobile:{
      type:Number,
      required:true
    },
    email:{
      type:String,
      required:true
    },
    is_approved:{
      type:Boolean,
     default:false
    },
    is_rejected:{
    type:Boolean
    },
    date:{
       type:Date,

    },
    amenities:[
        {
            name: {
              type: String
             
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
    surroundings:[
      {
      type:{
        type_name:{
            type:String
        },
        description:{
            type:String
        },
        items:[
          {
            name:{
                type:String
               },
               distence_From_Resort:{
                type:Number
               }
          }
        ]
      }
      }
    ]

   
   
})

module.exports = mongoose.model("resorts",resortSchema);