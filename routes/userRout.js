   const {Router}  = require("express")
  
   const usercontroller = require("../controllers/UserController")
   const bookingController = require("../controllers/bookingController")


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
   router.post("/hoster-req",usercontroller.saveReq)
   router.get("/forget-otp",usercontroller.forgetotp)
   router.post("/newpassword",usercontroller.updatePassword)
   router.post("/file",upload.single("file"),(req,res)=>{
      try {
         console.log("haiiii");
         console.log(req.file);
      } catch (error) {
         console.log(error.message);
      }
   })

   router.get("/getResorts",bookingController.getResorts)
   router.get("/getSingleView",bookingController.getSingleView)


   module.exports =router