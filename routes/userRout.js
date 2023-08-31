   const {Router}  = require("express")
  
   const usercontroller = require("../controllers/UserController")


   const router = Router()

   router.post("/userRegister",usercontroller.Postregister)
   router.post('/userLogin',usercontroller.ValidateLOgin)
   router.get('/userLogin',usercontroller.Authenticate)
   router.get("/getUser",usercontroller.getUser)
   router.post("/verify",usercontroller.verifyuser)
   router.post("/hoster-req",usercontroller.saveReq)
   router.get("/forget-otp",usercontroller.forgetotp)
   router.post("/newpassword",usercontroller.updatePassword)
   



   module.exports =router