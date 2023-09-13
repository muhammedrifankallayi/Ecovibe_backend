const mongoose = require("mongoose")


const today = new Date()
today.setDate(today.getDate()+2)


const messageShema = new mongoose.Schema({

connectionId:{
type:String,
required:true
},

fromId:{
    type:String,
    required:true
},
toId:{
    type:String,
    required:true
},
message:{
    type:String,
    required:true
},
expireDate:{
  type:Date,
  default:today
}
},
{
    timestamps:true
})

module.exports = mongoose.model("chatMessages",messageShema)