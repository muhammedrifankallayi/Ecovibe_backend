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


            console.log(req.user_id);
            res.status(200).json({ data, mainImg: data.show_img.slice(0, 4), rooms: roomdata.rooms ,reviews ,userId:req.user_id })
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

// deleting expired booking from bookings
        
        const Room = await Rooms.findOne({ resort_id: resortId });
        const today = new Date();
        
        Room.rooms.forEach(room => {
            room.bookings = room.bookings.filter(booking => booking.checkOutDate <= today);
        });
        await Room.save()


        if (Room) {
          const matchingRooms = Room.rooms.filter((room) => {
            return (
              room.available === true &&
              room.adults >= adults &&
              room.childrens >= children 
            );
          });
        
        if(matchingRooms.length!==0){
            res.status(200).send({rooms:matchingRooms})
        }else{
            res.status(404).send({message:`Rooms are not available for ${adults} adults and ${children} children`})
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
const roomData = await Rooms.findOne({resort_id:resortId})
const priceOf = roomData.rooms.find((value)=>value._id.toString()===roomId )



const bill = { guestId: userId,
    checkInDate: new Date(bookingdata.checkin),
    checkOutDate: new Date(bookingdata.checkout)}
    priceOf.bookings.push(bill)
    await roomData.save()
if(bookingdata){
    const Booking = new Bookings({
        user_id:userId,
        resoert_id:resortId,
        room_id:roomId,
        name:name,
        mobile:mobile,
        address:address,
        email:email,
        age:age,

    })

   
    
  
  
   
  

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


const getUserBookings = async(req,res)=>{
    try {
       
     const userId = req.user_id
     const data = await Bookings.find({user_id:userId,placed:true}).populate("resoert_id")




     res.status(200).send({data})

    } catch (error) {
        console.log(error.message);
    }
}

const ViewRoom = async(req,res)=>{
    
    try {
        const resortId = req.query.resortId
        const roomId = req.query.roomId
const data = await Rooms.findOne({resort_id:resortId})
const room = data.rooms.find((val)=>val._id.toString()===roomId)

res.status(200).send(room)

    } catch (error) {
        
    }
}

const CancelBooking = async(request,response)=>{
    try {
        
   const BID = request.body.id
   await Bookings.findOneAndUpdate({_id:BID},{$set:{placed:false}}).then(()=>{
    response.status(200).send({message:"Booking Cancelled"})
   },(err)=>{
    response.status(400).send({message:"Cat't cancel"})
   })
  

    } catch (error) {
        console.log(error.message);
    }
}

const dropquestions =  async(req,res)=>{
    try {
const id  = req.body.data.id
const question = req.body.data.question

const x = {user_id:req.user_id,question:question}

        const ResortData = await Resorts.findOne({_id:id})
if(ResortData){
   
    ResortData.questions.push(x)
    await ResortData.save()
    res.status(200).send({message:"question dropped"})
}

    } catch (error) {
        console.log(error.message);
    }
}

const checkAvailableOnDate = async(req,res)=>{
    try {
        
    const resortId = req.body.data.resortId
    const roomId = req.body.data.roomId
    const checkIn = req.body.data.checkIn
    const checkOut = req.body.data.checkOut

    const today = new Date();
    var roomdata = await  Rooms.findOne({resort_id:resortId})
    roomdata.rooms.forEach(room => {
        room.bookings = room.bookings.filter(booking => booking.checkOutDate <= today);
    });
    roomdata =    await roomdata.save()
    const date1 = new Date(checkIn);
    const date2 = new Date(checkOut);
    const selectedRoom = roomdata.rooms.find((room)=>room._id.toString()===roomId)
    

    const avalabledays = []
    var prevdate = null
    
           selectedRoom.bookings.forEach((item)=>{
            const checkin  = new  Date(item.checkInDate)
      if(prevdate){
    
    const diff = checkin - prevdate
    const days = diff /  (1000 * 3600 * 24);
    if(days>1){
        avalabledays.push({checkin,prevdate})
    }
      }     
           prevdate= new Date(item.checkOutDate)
           })

    
    const timeDifference = Math.abs(date2 - date1);
    const daysDifference = timeDifference / (1000 * 3600 * 24);
   
       selectedRoom.bookings.forEach((item)=>{
        const checkin  = new  Date(item.checkInDate)
        const checkout = new  Date(item.checkOutDate)
       
        if(checkin>date1 && checkout<date2){
         
           return res.status(400).send({message:`sorry ! room already booked between ${checkin} and ${checkout}`}) 
        }else if(checkin<date1 && checkout>date2){
           
            return res.status(400).send({message:`sorry ! room already booked between ${checkin.toDateString()} and ${checkout.toDateString()}`}) 
        }else if(checkin<date1 && checkout>date1){
           
            return res.status(400).send({message:`sorry ! room already booked you cant checkin between ${checkin} and ${checkout}`}) 
        }else if(checkin<date2 && checkout>date2){
            return res.status(400).send({message:`sorry ! you cant set checkout between ${checkin} and ${checkout} , beacause room already room already booked that days`}) 
        }else{
          
         return   res.status(200).send({message:"Room available in that days",avalabledays})
        }
       })



   


        

    } catch (error) {
        console.log(error.message);
    }
}


const categoryWise = async(req,res)=>{
    try {
        
    const category = req.query.category

    const data  = await Resorts.find({resort_type:category})
if(data.length>0){
    res.status(200).send(data)
}else{
    res.status(400).send({message:"currently not available"})
}

    

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
    submitRating,
    getUserBookings,
    ViewRoom,
    CancelBooking,
    dropquestions,
    checkAvailableOnDate,
    categoryWise
}