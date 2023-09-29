   const {Router}  = require("express")
  
   const usercontroller = require("../controllers/UserController")
   const bookingController = require("../controllers/bookingController")
   const chatController = require("../controllers/chatController")


const userdecoder = require("../middlewares/userDecoder")
   const router = Router()


   const multer = require("multer")
const path = require("path")

const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, path.join(__dirname,'../public/resort_img'))
    },
    filename: (req, file, callBack) => {
        callBack(null, `ccvvFunOfHeuristic_${file.originalname}`)
    }
  })



 



  
const upload = multer({ storage: storage })

   router.post("/userRegister",usercontroller.Postregister)
   router.post('/userLogin',usercontroller.ValidateLOgin)
   router.get('/userLogin',usercontroller.Authenticate)
   router.get("/getUser",usercontroller.getUser)
   router.post("/verify",usercontroller.verifyuser)
   router.post("/hoster-req",userdecoder.decoder,usercontroller.saveReq)
   router.get("/forget-otp",usercontroller.forgetotp)
   router.post("/newpassword",usercontroller.updatePassword)
   router.post("/file",upload.single("file"),userdecoder.decoder,usercontroller.userProfileImage)

   router.get("/getResorts",bookingController.getResorts)
   router.get("/getSingleView",userdecoder.decoder,bookingController.getSingleView)

   router.post("/availability",bookingController.checkAvailability)
   router.get("/getroom",bookingController.getRoomData)
   router.post("/placebooking",userdecoder.decoder,bookingController.placeBooking)
   router.patch("/confirmbooking",userdecoder.decoder,bookingController.confirmBooking) 
   router.get("/getsubscription",usercontroller.getSubscriptions)
   router.patch('/subscriptionpurchase',userdecoder.decoder,usercontroller.subscriptionPurchase)
   router.get("/isAdmin",usercontroller.isAdmin)

   router.get("/notifications",userdecoder.decoder,usercontroller.notification)
   router.get("/getnotificationlength",userdecoder.decoder,usercontroller.notifiLength)

   router.get("/chatview",userdecoder.decoder,chatController.viewChatMessages)
   router.post("/submitmsg",userdecoder.decoder,chatController.submitMsg)
   router.get("/userchatlist",userdecoder.decoder,chatController.chatList) 

   router.put("/editprofile",userdecoder.decoder,usercontroller.editProfile)


 
router.post("/commentsubmit",userdecoder.decoder,bookingController.submitComments)
router.patch("/submitrating",bookingController.submitRating)

router.post("/addtowishlist",userdecoder.decoder,usercontroller.addToWhishList)
router.get("/getwishlist",userdecoder.decoder,usercontroller.getWishList)
router.patch("/removefromwish",userdecoder.decoder,usercontroller.removeWhishlist)
router.post("/checkpassword",userdecoder.decoder,usercontroller.passwordCheck)
router.patch("/updatepassword",userdecoder.decoder,usercontroller.resetPassword)

router.get("/getuserbookings",userdecoder.decoder,bookingController.getUserBookings)
router.get("/viewroom",bookingController.ViewRoom)
router.patch("/cancelbooking",bookingController.CancelBooking)

router.post("/dropquestion",userdecoder.decoder,bookingController.dropquestions)
router.post("/getavailableondate",bookingController.checkAvailableOnDate)

router.get("/categorywise",bookingController.categoryWise)

   module.exports =router