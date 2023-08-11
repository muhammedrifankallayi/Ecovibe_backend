   const {Router}  = require("express")
  
   const usercontroller = require("../controllers/UserController")


   const router = Router()

   router.post("/userlogin",usercontroller.Postregister)
   



   module.exports ={router}