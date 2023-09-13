const mongoose  = require("mongoose")


const chatConnectionShema = new mongoose.Schema({

user_id:{
    type:String,
    required:true
},
admin_id:{
    type:String,
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