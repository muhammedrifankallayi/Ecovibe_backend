
const ChatConnections = require("../models/chatConnectionModel");
const ChatMessages = require("../models/chatMessageModel");





const viewChatMessages = async(req,res)=>{
    try {
        
     const userId = req.user_id
     const adminId = req.query.id
  
 const connection = await ChatConnections.findOne({user_id:userId,admin_id:adminId})
     const messageData = await ChatMessages.find({connectionId:connection._id})
     console.log(messageData);
     res.status(200).send({data:messageData})

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
     var connectionsId = ConnectionData?ConnectionData._id:null
     if(!ConnectionData){
        const chatconnet = new ChatConnections({
            user_id:userId,
            admin_id:adminId
        })
       const connect =  await chatconnet.save()
       connectionsId = connect._id 
        await ChatConnections.findByIdAndUpdate({_id:connect._id},{$set:{lastmessage:message}})
     }



     const NewMsg = new ChatMessages({
        connectionId:connectionsId,
        fromId:userId,
        toId:adminId,
        message:message
     })

     await NewMsg.save()
     
     res.status(200).send({})

    } catch (error) {
        console.log(error.messsage);
    }
}

const chatList = async(req,res)=>{
    try {
         const userId = req.user_id

         const connectionData = await ChatConnections.find({user_id:userId})
         res.status(200).send({list:connectionData})


    } catch (error) {
        console.log(error.message);
    }
}


const adminChatList = async(req,res)=>{
    try {
        
   const adminId = req.admin_id
   const chatList = await ChatConnections.find({admin_id:adminId})

   res.status(200).send({list:chatList})
   


    } catch (error) {
        console.log(error.message);
    }
}

const adminSingleViewChat = async(req,res)=>{
    try {
        const adminId = req.admin_id
        const userId = req.query.id
        const connect = await ChatConnections.findOne({user_id:userId,admin_id:adminId})
        const messages = await ChatMessages.find({connectionId:connect._id})
        res.status(200).send({data:messages})
    } catch (error) {
        console.log(error.message);
    }
}
const adminSubmitMsg = async(req,res)=>{
    try {
        
     const adminId = req.admin_id
     const userId = req.body.data.user_id
     const message = req.body.data.text
     const connect = await ChatConnections.findOne({user_id:userId,admin_id:adminId})
     const NewMsg = new ChatMessages({
        fromId:adminId,
        toId:userId,
        connectionId:connect._id
     })
     await NewMsg.save();
     await ChatConnections.findByIdAndUpdate({_id:connect._id},{$set:{lastmessage:message}})
     res.status(200).send({})
    } catch (error) {
        console.log(error.massage);
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