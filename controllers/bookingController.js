const jwt = require("jsonwebtoken")

const Resorts = require("../models/resortModel");
const Users = require("../models/UserModel");




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

   
   res.status(200).json({data,mainImg:data.show_img.slice(0, 4)})

    } catch (error) {
        console.log(error.message);
    }
}


module.exports = {
    getResorts,
    getSingleView
}