
//models
const Users = require('../models/UserModel');
const Subscription = require("../models/subscriptionModel")
const Resort = require("../models/resortModel")

// modules
const jwt = require("jsonwebtoken")


// token encoding 
function tokenReader(token){
    const decoded = jwt.verify(token, 'adminsecret');
    return decoded._id
  }


const adminVerify = async(req,res)=>{
    console.log("admin working");

    console.log(req.body,'data success');
    try {

        const details = req.body.data

    const email = details.email
    const password = details.password

    const data = await Users.findOne({email:email})

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






module.exports ={
    adminVerify,
    getAdmin,
    getresort
}