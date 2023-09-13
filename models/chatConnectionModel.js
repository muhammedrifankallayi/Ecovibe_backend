const mongoose  = require("mongoose")


const chatConnectionShema = new mongoose.Schema({

user_id:{
    type:String,
    ref:"Users",
    required:true
},
admin_id:{
    type:String,
    ref:"resorts",
    require:true
},
lastmessage:{
    type:String
}


},
{
    timestamps:true
}
)



module.exports = mongoose.model("chatConnection",chatConnectionShema)