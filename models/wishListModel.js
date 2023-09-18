const mongoose = require("mongoose")


const whishListSchema = new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    List:[
        {
          resortId:  {
                type:String,
                ref:"resorts",
                required:true
            }
        }
    ]
})

module.exports = mongoose.model("wishlist",whishListSchema)