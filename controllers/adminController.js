
//models
const Users = require('../models/UserModel');
const Subscription = require("../models/subscriptionModel")
const Resort = require("../models/resortModel")
const Bookings = require("../models/bookingsModel")
const Notification = require("../models/notificationModel")
const Room = require("../models/roomModel")

// modules
const jwt = require("jsonwebtoken")


// token encoding 
function tokenReader(token){
    const decoded = jwt.verify(token, 'adminsecret');
    return decoded._id
  }


const adminVerify = async(req,res)=>{

  
    try {

        const details = req.body.data

    const email = details.email
    const password = details.password

    const data = await Users.findOne({email:email})

    const adminId = data._id

    const resortData = await Resort.findOne({hoster_id:adminId})
console.log(resortData.subcription_End+"subcription_End");
const currentDate = new Date()

const expireDate = new Date(resortData.subcription_End)

     if(expireDate<currentDate){
      return  res.status(400).send({message:"subscription expired . please purchase a plan",id:data._id})
     }else if(!resortData.subcription_End){
      return  res.status(400).send({message:" please purchase a subscription plan",id:data._id})

     }



    if(data){
        if(password===data.password){
            if(data.is_admin===true){
                const token  = jwt.sign({_id:data._id},"adminsecret")
               return res.status(200).send({message:"success",token})

            }else{
                res.status(404).send({message:"Not admin"})
            }
        }else{
      return  res.status(403).send({message:"password Not match"})
        }
    }

  return  res.status(404).send({message:'Admin Not Found'})

        
    } catch (error) {
        console.log(error.message);
    }
}

const getAdmin = async(req,res)=>{
    try {

 
 const token = req.header('Authorization')?.split(' ')[1]; // Get the token from the header
if (!token) {
    console.log("not working..............>");
  return res.status(401).json({ message: 'Access denied. No token provided.',Authorization:false });
}
const decoded = jwt.verify(token, 'adminsecret'); // Verify and decode the token
    const id = decoded._id
    const data = await Users.findById({_id:id})
     console.log(data);
    res.status(200).json({data})
        
    } catch (error) {
        console.log(error.message);
    }
}

const   getresort  = async(req,res)=>{
    try {
        
     const userId = tokenReader(req.query.token)

     const resort  = await Resort.findOne({hoster_id:userId})
     const user  = await Users.findById({_id:userId})

     res.status(200).json({resort,user})


    } catch (error) {
        
    }
}


const getBookings = async(req,res)=>{
    try {

   const id  = req.admin_id

   const resort = await Resort.findOne({hoster_id:id})

   const data = await Bookings.find({resoert_id:resort._id})

 console.log(data);

   res.status(200).send(data)
    

        
    } catch (error) {
        console.log(error.message +'booking');
    }
}

const CancelBooking = async(req,res)=>{
const data = await Bookings.findOne({_id:req.body.id})
const notify = new Notification({
    user_id:data.user_id,
    notification:"sorry your booking has been cancelled by admin due to some issue , for more detail contact us or chat with us"
})

    try {
        const BID = req.body.id
await Bookings.findOneAndUpdate({_id:BID},{$set:{placed:false}})
await notify.save().then(()=>{
    
    res.status(200).send({message:"cancelled booking successfully"})
},(err)=>{
    res.status(400).send({message:err})
})

    } catch (error) {
        
    }
}

const saveprofile = async(req,res)=>{
    try {
        const data = req.body.data
        const update = await Users.findOneAndUpdate({_id:req.admin_id},{$set:{name:data.name,mobile:data.mobile,email:data.email}}).then(()=>{
            res.status(200).send({message:"saved successfully"})
        }).catch((err)=>{
            res.status(400).send({message:err})
        })
    } catch (error) {
        console.log(error.message);
    }
}

const getRomm = async(req,res)=>{
    try {

        const roomid = req.body.id
        const rooms = await Room.findOne({_id:req.admin_id})
    
        
    } catch (error) {
        console.log(error.message,"admin getroom");
    }
}




module.exports ={
    adminVerify,
    getAdmin,
    getresort,
    getBookings,
    CancelBooking,
    saveprofile
}