const mongoose = require("mongoose")


const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        require:true
    },
    mobile:{
       type:Number,
       require:true
    },
    password:{
        type:String,
        require:true
    }
})

module.exports = mongoose.model("Users",UserSchema)