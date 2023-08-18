const Users = require("../models/UserModel")



const VerifySuper = async(req,res)=>{
    try {

      

        const details = req.body.data
        const email = details.email
        const password = details.password
        console.log(email);
    
        const data = await Users.findOne({email:email})
     console.log(data);
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
        }else{
            return   res.status(404).send({message:'Admin Not Found'})
        
        }
   
        
    } catch (error) {
        
     console.log(error.message);

    }
}

module.exports = {
    VerifySuper
}