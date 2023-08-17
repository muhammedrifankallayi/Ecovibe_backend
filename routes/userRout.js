   const {Router}  = require("express")
  
   const usercontroller = require("../controllers/UserController")


   const router = Router()

   router.post("/userRegister",usercontroller.Postregister)
   router.post('/userLogin',usercontroller.ValidateLOgin)
   router.get('/userLogin',usercontroller.Authenticate)
   



   module.exports =router