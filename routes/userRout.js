   const {Router}  = require("express")
  
   const usercontroller = require("../controllers/UserController")
   const bookingController = require("../controllers/bookingController")
const userdecoder = require("../middlewares/userDecoder")
   const router = Router()


   const multer = require("multer")
const path = require("path")

const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, path.join(__dirname,'../public'))
    },
    filename: (req, file, callBack) => {
        callBack(null, `FunOfHeuristic_${file.originalname}`)
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
   router.post("/file",upload.single("file"))

   router.get("/getResorts",bookingController.getResorts)
   router.get("/getSingleView",bookingController.getSingleView)

   router.post("/availability",bookingController.checkAvailability)
   router.get("/getroom",bookingController.getRoomData)
   router.post("/placebooking",userdecoder.decoder,bookingController.placeBooking)
   router.patch("/confirmbooking",userdecoder.decoder,bookingController.confirmBooking) 
   router.get("/getsubscription",usercontroller.getSubscriptions)
   router.patch('/subscriptionpurchase',userdecoder.decoder,usercontroller.subscriptionPurchase)
   router.get("/isAdmin",userdecoder.decoder,usercontroller.isAdmin)

   router.get("/notifications",userdecoder.decoder,usercontroller.notification)
   router.get("/getnotificationlength",userdecoder.decoder,usercontroller.notifiLength)
   module.exports =router