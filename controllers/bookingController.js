const jwt = require("jsonwebtoken")

const Resorts = require("../models/resortModel");
const Users = require("../models/UserModel");
const Rooms = require("../models/roomModel")
const Bookings = require("../models/bookingsModel")



const getResorts = async (req, res) => {
    try {

        const data = await Resorts.find()
        console.log(data);
        res.status(200).json({ data })

    } catch (error) {
        console.log(error.message);
    }
}


const getSingleView = async (req, res) => {
    try {
        console.log("singleview");
        const id = req.query.id
        const data = await Resorts.findById({ _id: id });
        const roomdata = await Rooms.findOne({ resort_id: id })

        if (roomdata) {
            res.status(200).json({ data, mainImg: data.show_img.slice(0, 4), rooms: roomdata.rooms })
        } else {
            res.status(200).json({ data, mainImg: data.show_img.slice(0, 4), rooms: [] })

        }



    } catch (error) {
        console.log(error.message);
    }
}


const checkAvailability = async (req, res) => {
    try {
        const body = req.body.data;
        const checkIn = body.checkin;
        const checkOut = body.checkout;
        const adults = body.adults;
        const children = body.childrens;
        const resortId = body.resort_id;
        
        const Room = await Rooms.findOne({ resort_id: resortId });
        
        if (Room) {
          const matchingRooms = Room.rooms.filter((room) => {
            return (
              room.available === true &&
              room.adults === adults &&
              room.childrens === children
            );
          });
        
        if(matchingRooms.length!==0){
            res.status(200).send({rooms:matchingRooms})
        }else{
            res.status(404).send({message:`Rooms are not available in ${checkIn}`})
        }
        } else {
         res.status(404).send({message:"Resort not found"})
        }
        



    } catch (error) {
console.log(error.message);
    }
}

 const getRoomData  = async(req,res)=>{
    try {
       
        const resort_id =  req.query.resort_id
        const room_id  =  req.query.room_id
        console.log(room_id);
        const roomData = await Rooms.findOne({resort_id:resort_id})
        const resortData = await Resorts.findById({_id:resort_id})
        const room = roomData.rooms.filter((room)=>{
            return  room._id.toString() === room_id
        })
        console.log(room);

        res.status(200).send({room,resortData})

    } catch (error) {
        console.log(error.message);
    }
 }



const placeBooking = async(req,res)=>{
    try {
        console.log('working ..booking');
        console.log(req.user_id);
const bookingdata = req.body.data
const userId = req.user_id
const name = bookingdata.name
const email = bookingdata.email
const address = bookingdata.address
const mobile = parseInt(bookingdata.mobile)
const resortId = bookingdata.resort_id
const roomId = bookingdata.room_id
const age = parseInt( bookingdata.age)

if(bookingdata){
    const Booking = new Bookings({
        user_id:userId,
        resoert_id:resortId,
        room_id:roomId,
        name:name,
        mobile:mobile,
        address:address,
        email:email,
        age:age
    })
   await   Booking.save().then(()=>{
    res.status(200).json({message:"successfull"})
  },(err)=>{
    res.status(400).send({message:"booking failed",err})
  })
  
}



    } catch (error) {
        console.log(error.message);
    res.status(400).send({message:"booking failed",error:error.message})
        
    }
}

const confirmBooking = async(req,res)=>{
    try {
        const user = req.user_id
        await Bookings.findOneAndUpdate({user_id:user},{$set:{placed:true,payment_id:req.body.data.payment_id}}).then(()=>{
            res.status(200).send({message:"Booking cofirmed successfully"})
        },(err)=>{
            res.status(400).send({message:"Booking failed",err})
        })
    } catch (error) {
        console.log(error.message);
    }
}




module.exports = {
    getResorts,
    getSingleView,
    checkAvailability,
    getRoomData,
    placeBooking,
    confirmBooking
}