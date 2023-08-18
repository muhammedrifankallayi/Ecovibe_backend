const Users = require('../models/UserModel');




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
               return res.status(200).send({message:"success"})
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

module.exports ={
    adminVerify
}