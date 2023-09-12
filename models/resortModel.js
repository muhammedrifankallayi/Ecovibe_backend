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
            },
            is_list:{
              type:Boolean,
              default:true
            }
          }
    ],
    occupency:{
        type:Number,
        required:true
    },
    surroundings:[
      {
    
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
               distance_From_Resort:{
                type:Number
               }
          }
        ],
        is_list:{
          type:Boolean,
          default:true
        }
      
      }
    ],
    restaurants:[
      {
        name:{
          type:String,

        },
        distance:{
          type:Number
        },
        is_list:{
 type:Boolean,
 default:true
        }
      }
    ],
    images:{
      type:Array,
      
    },

    subcription_Date:{
      type:Date
        },
        
        subcription_End:{
          type:Date
        }
        ,
        show_img:{
          type:Array
          
        },
        Banner_img:{
            type:String
        },

        reviews:{
          type:Array,
          
        }

   
   
})

module.exports = mongoose.model("resorts",resortSchema);