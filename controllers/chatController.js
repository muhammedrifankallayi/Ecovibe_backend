
const ChatConnections = require("../models/chatConnectionModel");
const ChatMessages = require("../models/chatMessageModel");
const Resorts = require("../models/resortModel")





const viewChatMessages = async(req,res)=>{
    try {
        
     const userId = req.user_id
     const adminId = req.query.id
  
 const connection = await ChatConnections.findOne({user_id:userId,admin_id:adminId})
    
if(connection){
    const messageData = await ChatMessages.find({connectionId:connection._id})

    res.status(200).send({data:messageData,id:userId,cId:connection._id})
console.log("ooll");
}else{
    res.status(200).send({data:[],id:userId,cId:null})

}


    } catch (error) {
        console.log(error.message);
    }
}

const submitMsg = async(req,res)=>{

    try {
     const message = req.body.data.text
     const userId = req.user_id
     const adminId = req.body.data.id

     const ConnectionData = await ChatConnections.findOne({user_id:userId,admin_id:adminId})
     var connectionsId =''
     if(!ConnectionData){
        const chatconnet = new ChatConnections({
            user_id:userId,
            admin_id:adminId
        })
       const connect =  await chatconnet.save()
       connectionsId = connect._id 
     }else{
        connectionsId = ConnectionData._id
     }
     await ChatConnections.findByIdAndUpdate({_id:connectionsId},{$set:{lastmessage:message}})




     const NewMsg = new ChatMessages({
        connectionId:connectionsId,
        fromId:userId,
        toId:adminId,
        message:message
     })

    const data =  await NewMsg.save()
     
     res.status(200).send({data})

    } catch (error) {
        console.log(error.messsage);
    }
}

const chatList = async(req,res)=>{
    try {
         const userId = req.user_id
       
         const connectionData = await ChatConnections.find({user_id:userId}).populate("admin_id")
         res.status(200).send({list:connectionData,userId})


    } catch (error) {
        console.log(error.message);
    }
}


const adminChatList = async(req,res)=>{
    try {
        
   const adminId = req.admin_id
   const resort = await Resorts.findOne({hoster_id:adminId})
   const chatList = await ChatConnections.find({admin_id:resort._id}).populate("user_id")

   res.status(200).send({list:chatList})
   


    } catch (error) {
        console.log(error.message);
    }
}

const adminSingleViewChat = async(req,res)=>{
    try {
        const adminId = req.admin_id
        const userId = req.query.id
        const resort = await Resorts.findOne({hoster_id:adminId})
        const connect = await ChatConnections.findOne({user_id:userId,admin_id:resort._id})
        const messages = await ChatMessages.find({connectionId:connect._id})
        res.status(200).send({data:messages,id:resort._id,cId:connect._id})
    } catch (error) {
        console.log(error.message);
    }
}
const adminSubmitMsg = async(req,res)=>{
    try {

     const adminId = req.admin_id
     const userId = req.body.data.user_id
     const message = req.body.data.text


     const resort = await Resorts.findOne({hoster_id:adminId})
    
     const connect = await ChatConnections.findOne({user_id:userId,admin_id:resort._id})
     const NewMsg = new ChatMessages({
        fromId:resort._id,
        toId:userId,
        connectionId:connect._id,
        message:message
     })
     const data = await NewMsg.save();
     await ChatConnections.findByIdAndUpdate({_id:connect._id},{$set:{lastmessage:message}})


     res.status(200).send({message:"success",data})
    } catch (error) {
        console.log(error.message);
    }
}





module.exports = {
    viewChatMessages,
    submitMsg,
    adminChatList,
    adminSingleViewChat,
    adminSubmitMsg,
    chatList
}