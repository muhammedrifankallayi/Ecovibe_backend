const Rooms = require("../models/roomModel")
const Resorts = require("../models/resortModel")
const jwt  = require("jsonwebtoken")


//functions

function tokenReader(token){
    const decoded = jwt.verify(token,'adminsecret');
    return decoded._id
  }






const submitRoom = async(req,res)=>{

console.log('submitroom');

    try {
        const data = req.body.data
        const token = req.headers.authorization?.split(" ")[1];
        const hoster_id = tokenReader(token)
        
const resort = await Resorts.findOne({hoster_id:hoster_id})
const isRoom = await Rooms.findOne({hoster_id:hoster_id})
if(!hoster_id | resort){
    return res.status(404).send({message:'resort not found '})
}


if(!isRoom){

    console.log("rooms creating");
    const room = new Rooms({
        hoster_id:hoster_id,
        resort_id:resort._id,
        rooms:[
            {
                roomNumber:parseInt(data.roomNumber),
                roomType:data.roomType,
                capacity:parseInt(data.capacity),
                pricePerNight:parseInt(data.pricePerNight),
                amenities:data.amenities,
                adults:parseInt(data.adults),
                childrens:parseInt(data.childrens),
                beds:parseInt(data.beds)

            }
        ]
    })

    await room.save().then(()=>{
        res.status(200).send({message:"success"})
    })
}else{
    const room  =   {
        roomNumber:parseInt(data.roomNumber),
        roomType:data.roomType,
        capacity:parseInt(data.capacity),
        pricePerNight:parseInt(data.pricePerNight),
        amenities:data.amenities,
        adults:parseInt(data.adults),
        childrens:parseInt(data.childrens),
        beds:parseInt(data.beds)
        

    }

    await Rooms.findByIdAndUpdate({_id:isRoom._id},{$push:{rooms:room}}).then(()=>{
        res.status(200).send({message:"successfully saved roomData"})
    }).catch((err)=>{
        res.status(401).send({message:"something wrong , Cant save ",err})
    })
}
   
    } catch (error) {
        
    console.log(error.message);

    }
}

 const getRoomdata = async(req,res)=>{
    try {
       
        const token = req.headers.authorization?.split(" ")[1];
        const hoster_id = tokenReader(token)

        const roomData = await Rooms.findOne({hoster_id:hoster_id})

        if(roomData){
            res.status(200).send({data:roomData.rooms})
        }
        
    

    } catch (error) {
        console.log(error.message);
    }
 }



module.exports = {
    submitRoom,
    getRoomdata
}