const Users = require("../models/UserModel")



const VerifySuper = async(req,res)=>{
    try {

        console.log(req.body);
        const email = req.body.email
        const password = req.body.password
    
        const data = await Users.findOne({email:email})
    
        if(data){
            if(password===data.password){
                if(data.is_superAdmin===true){
                   return res.status(200).send({message:"success"})
                }else{
                    res.status(404).send({message:"Not superAdmin"})
                }
            }else{
          return  res.status(403).send({message:"password Not match"})
            }
        }
     return   res.status(404).send({message:'Admin Not Found'})
        
        
    } catch (error) {
        
     console.log(error.message);

    }
}

module.exports = {
    VerifySuper
}