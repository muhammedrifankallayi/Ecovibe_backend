const User = require("../models/UserModel")
const jwt       =     require("jsonwebtoken")
const bcrypt    = require("bcrypt")



const Postregister = async(req,res)=>{
    try {
console.log("works");
      const name   = req.body.userName
      const email  = req.body.email
      const mobile = parseInt(req.body.mobile)
      const password = req.body.password
const userExist = await User.findOne({email:email})

if(userExist){
    return res.status(400).send({
   message : 'user already exist'
    })
}else{
    const user = new User({
        name:name,
        email:email,
        mobile:mobile,
        password:password,
        Date: new Date()
     })

 const result  =  await user.save()

 const {_id} =  await result.toJSON()

 const token  = jwt.sign({_id:_id},"secret")
 res.cookie("jwt",token,{
     httpOnly:true,
     maxAge:60*60*24*1000
 })
 console.log(token);

 res.status(200).send({message:"success",token})

 }

    } catch (error) {
        console.log(error.message);
    }
}

const  ValidateLOgin = async(req,res)=>{
    try {
       const FormData = req.body.FormData
        const email  = FormData.email
        const Password = FormData.password
        const UsreData = await User.findOne({email:email})
        if(UsreData){
            
            if(Password===UsreData.password){
                const {_id} =  await UsreData.toJSON()

 const token  = jwt.sign({_id:_id},"secret")
 res.cookie("jwt",token,{
     httpOnly:true,
     maxAge:60*60*24*1000
 })
 
             res.status(200).send({message:"success",user:UsreData.name,token})
               
                
            }else{
              

          res.status(401).send({message:"Password is not correct"})
            
            }
        }
       
        res.status(401).send({message:"User Not Found"})
    } catch (error) {
        console.log("Error",error);
    }
}

const Authenticate = async(req,res)=>{
    const token = req.header('Authorization')?.split(' ')[1]; // Get the token from the header
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.',Authorization:false });
    }
  
    try {
      const decoded = jwt.verify(token, 'secret'); // Verify and decode the token
     if(decoded){
        return res.status(200).json({ message: 'User Authentication has been successfull',Authorization:true });
     }
    } catch (error) {
      res.status(400).json({ message: 'Invalid token.' });
    }
  }


module.exports = {
    Postregister,
    ValidateLOgin,
    Authenticate
}