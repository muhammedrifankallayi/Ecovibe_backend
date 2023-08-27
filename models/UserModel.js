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
    },
    image:{
     type:String,
    
    },
    Date:{
        type: Date
    },
    is_admin:{
        type:Boolean,
        default:false
    },
    is_superAdmin:{
        type:Boolean,
        default:false
    },
    is_verified:{
        type:Boolean,
        default:false
    },
    is_blocked:{
      type:Boolean,
      default:false
    },
    resort_id:{
        type:String
    }
})

module.exports = mongoose.model("Users",UserSchema)