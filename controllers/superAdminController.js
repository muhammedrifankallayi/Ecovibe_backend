const Users = require("../models/UserModel")

const Resort = require("../models/resortModel")




const VerifySuper = async(req,res)=>{
    try {

      console.log("working");

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

// get user detais 

const getUser = async(req,res)=>{
    try {
        console.log("working getuser");
        const data = await Users.find()
       return res.status(200).json({data})
    } catch (error) {
        console.log(error.message);
    }
}

const blockUser = async(req,res)=>{
    try {
      
       const id =  req.body.id

      const data = await Users.findOne({_id:id})

      console.log(data);

      if(data.is_blocked===false){
        await Users.findByIdAndUpdate({_id:id},{$set:{is_blocked:true}})
      }else{
        await Users.findByIdAndUpdate({_id:id},{$set:{is_blocked:false}})
      }

    } catch (error) {
        console.log(error.message);
    }
}



//  getting resort hoster requests

const getRequest = async(req,res)=>{
    try {
        
        console.log("works getreqq");
  const Data = await Resort.find({is_approved:false})

  console.log(Data);

 return res.status(200).send({Data,message:"success"})
    


    } catch (error) {
        console.log(error.message);
    }
}


// request approving 

const approveRequest = async(req,res)=>{
    try {
          
const id = req.params.id
console.log(id);
await Resort.findByIdAndUpdate({_id:id},{$set:{is_approved:true}})

res.status(200).json({success:true})

    } catch (error) {
console.log(error.message);        
    }
}

// request rejecting 

const rejectRequest = async(req,res)=>{
    try {
       const id  = req.params.id

       if(id!==null){
        await Resort.findByIdAndUpdate({_id:id},{$set:{is_rejected:true}}) 
res.status(200).json({success:true})
       }
    } catch (error) {
        console.log(error.message);
    }
}



module.exports = {
    VerifySuper,
    getUser,
    blockUser,
    getRequest,
    approveRequest,
    rejectRequest
}