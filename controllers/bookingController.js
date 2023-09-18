const jwt = require("jsonwebtoken")

const Resorts = require("../models/resortModel");
const Users = require("../models/UserModel");
const Rooms = require("../models/roomModel")
const Bookings = require("../models/bookingsModel")
const Reviews = require("../models/reviewsModel")
const ResortSales = require("../models/resortSalesModel")



const getResorts = async (req, res) => {
    try {
        const today = new Date()
        const data = await Resorts.find({subcription_End:{$gt:today}, images: { $exists: true, $ne: [] },is_approved:true})
   
        res.status(200).json({ data })

    } catch (error) {
        console.log(error.message);
    }
}


const getSingleView = async (req, res) => {
    try {
      
        const id = req.query.id
        const data = await Resorts.findById({ _id: id });
        const roomdata = await Rooms.findOne({ resort_id: id })
        const reviews = await Reviews.find({resort_id:id}).populate("user_id")
        if (roomdata) {
            res.status(200).json({ data, mainImg: data.show_img.slice(0, 4), rooms: roomdata.rooms ,reviews })
        } else {
            res.status(200).json({ data, mainImg: data.show_img.slice(0, 4), rooms: [] ,reviews })

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
     
        const roomData = await Rooms.findOne({resort_id:resort_id})
        const resortData = await Resorts.findById({_id:resort_id})
        const room = roomData.rooms.filter((room)=>{
            return  room._id.toString() === room_id
        })
      

        res.status(200).send({room,resortData})

    } catch (error) {
        console.log(error.message);
    }
 }



const placeBooking = async(req,res)=>{
    try {
       
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

   
    
   const roomData = await Rooms.findOne({resort_id:resortId})
   const priceOf = roomData.rooms.find((value)=>value._id.toString()===roomId )
   
   console.log(priceOf);

const Bill  = new ResortSales({
    resort_id:resortId,
    userId:userId,
   roomId:roomId,
   amount:priceOf.pricePerNight
})
await Bill.save()
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

const submitComments = async(req,res)=>{
    try {
        const userId = req.user_id
        const data = req.body.data
        const comment = data.comment
        const resort_id = data.resort_id
       
const review = new Reviews({
    user_id:userId,
    resort_id:resort_id,
    comment:comment,
   

})

 const result =  await review.save()
 const Data = await Reviews.populate(result, { path: 'user_id' });
    res.status(200).send(Data)


    } catch (error) {
        res.status(400).send({error})
        console.log(error.message);
    }
}

const submitRating = async(req,res)=>{
    try {
        const details = req.body.data
        const review_id = details.id
        const value = parseFloat(details.value)
        await Reviews.findByIdAndUpdate({_id:review_id},{$set:{rating:value}}).then(()=>{
            res.status(200).send({message:"rated"})
        },(err)=>{
            res.status(400).send({err})
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
    confirmBooking,
    submitComments,
    submitRating
}