const mongoose  = require("mongoose")


const roomSchema = new mongoose.Schema({

room_Type:{
    type:String,
    require:true
},
Bed:{
    type:String,
    required:true
},
maximum_occupency:{
    type:Number,
    required:true
},
price:{
    type:Number,
    required:true
},
facilities:[
    {
        name:{
            type:String
        },
        description:{
            type:String
        }

    }
]





   
})