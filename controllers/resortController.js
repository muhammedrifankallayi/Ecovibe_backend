const jwt = require("jsonwebtoken")

const Resorts = require("../models/resortModel");
const Users = require("../models/UserModel");



function tokenReader(token){
    const decoded = jwt.verify(token,'adminsecret');
    return decoded._id
  }
  

const getResort = async(req,res)=>{
    try {
       
        const token = req.headers.authorization?.split(" ")[1];

        const HosterId = tokenReader(token);
        console.log(HosterId);

const Hoster =  await Users.findById({_id:HosterId})

const ResortData = await Resorts.findById({_id:Hoster.resort_id});

if(ResortData){
    res.status(200).send({data:ResortData,Hoster})
}




    } catch (error) {
        console.log(error.message);
    }
}

const saveResortData = async(req,res)=>{
    try {
        const token = req.headers.authorization?.split(" ")[1]
        const hosterId = tokenReader(token)
      const hoster = await Users.findById({_id:hosterId})
   const data  = req.body.data
 console.log(data);
   await Resorts.updateOne({
    _id:hoster.resort_id
   },{$set:{
    resort_type:data.type,
    resortName:data.resortName,
    resortAdress:data.address,
    email:data.email,
    mobile:data.mobile,
    location:data.location,
    occupency:data.occupency
    
   }})

   await Users.updateOne({_id:hosterId},{$set:{name:data.hosterName}})

res.status(200).send({message:"saved successfully"})

    } catch (error) {
        console.log(error.message);
    }
}

const saveRestaurent = async(req,res)=>{
  console.log("restau works");
try {
    const token = req.headers.authorization?.split(" ")[1]
        const hosterId = tokenReader(token)
        console.log(hosterId);
        console.log(req.body);
        const data = {name:req.body.data.restaurant,distance:parseInt(req.body.data.distance)}

      await Resorts.findOneAndUpdate({hoster_id:hosterId},{$push:{restaurants:data}})
      const resortData = await Resorts.findOne({hoster_id:hosterId})
  const    restaurant = resortData.restaurants
       console.log(restaurant);

        res.status(200).send({data:restaurant})



} catch (error) {
    console.log(error.message);
}

}


const getRestaurants = async(req,res)=>{
    try {
        const token = req.headers.authorization?.split(" ")[1]
        const hosterId = tokenReader(token)

        const Resortdata = await Resorts.findOne({hoster_id:hosterId})

        res.status(200).send({data:Resortdata.restaurants})
     

    } catch (error) {
        console.log(error.message);
    }
}




module.exports = {
    getResort,
    saveResortData,
    saveRestaurent,
    getRestaurants
}