const Users = require("../models/UserModel")
const Subscription = require("../models/subscriptionModel")
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
  const update =  await Resort.findByIdAndUpdate({_id:id},{$set:{is_approved:true}})

if(update){

   const resortHoster = await Resort.findOne({_id:id})
   await Users.findByIdAndUpdate({_id:resortHoster.hoster_id},{$set:{is_admin:true,resort_id:resortHoster._id}})
    res.status(200).json({success:true})

}else{
res.status(401).json({success:true})

}

    } catch (error) {
console.log(error.message);        
    }
}

// request rejecting 

const rejectRequest = async(req,res)=>{
    try {
        console.log("works");
       const id  = req.params.id

       if(id!==null){
    const update =     await Resort.findByIdAndUpdate({_id:id},{$set:{is_rejected:true}}) 
      console.log(update);
    if(update){
        res.status(200).json({success:true})

    }else{
res.status(401).json({success:true})

    }
       }
    } catch (error) {
        console.log(error.message);
    }
}

const saveSubscription = async(req,res)=>{
    try {
        
console.log("workinnnffgg");
  const data = req.body.data

 console.log(data);
  const subcri = new Subscription({
    title:data.title,
    duration:data.duration,
    type:data.type,
    price:Number(data.price),
    description:data.description
  })

  const result = await subcri.save()

  if(result){
    res.status(200).send({message:"success"})
  }else{
    res.status(401).send({message:"failed to save"})

  }

    } catch (error) {
        console.log(error.message);
    }
}



//  getting subscriotion daata

const getSubscription = async(req,res)=>{
    try {
        

const data = await Subscription.find()
if(data){
    res.status(200).json({data})

}else{
    res.status(401).send({message:"failed to fetch the data"})
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
    rejectRequest,
    saveSubscription,
    getSubscription
}