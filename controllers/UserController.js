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
        password:password
     })

 const result  =  await user.save()

 const {_id} = await result.toJSON()

 const token  = jwt.sign({_id:_id},"secret")
 res.cookie("jwt",token,{
     httpOnly:true,
     maxAge:60*60*24
 })
 console.log(token);

 res.status(200).send({message:"success"})

 }




   


    } catch (error) {
        console.log(error.message);
    }
}



module.exports = {
    Postregister
}