const jwt = require("jsonwebtoken")

const Resorts = require("../models/resortModel");
const Users = require("../models/UserModel");
const Rooms = require("../models/roomModel")



const getResorts = async (req, res) => {
    try {

        const data = await Resorts.find()
        console.log(data);
        res.status(200).json({ data })

    } catch (error) {
        console.log(error.message);
    }
}


const getSingleView = async(req,res)=>{
    try {
        console.log("singleview");
   const id = req.query.id
   const data = await Resorts.findById({_id:id});
   const roomdata = await Rooms.findOne({resort_id:id})

   if(roomdata){
    res.status(200).json({data,mainImg:data.show_img.slice(0, 4),rooms:roomdata.rooms})
   }else{
    res.status(200).json({data,mainImg:data.show_img.slice(0, 4),rooms:[]})

   }
   
  

    } catch (error) {
        console.log(error.message);
    }
}


module.exports = {
    getResorts,
    getSingleView
}