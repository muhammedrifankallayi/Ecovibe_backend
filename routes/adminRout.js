const {Router}  = require("express")

const adminController = require("../controllers/adminController")

const router = Router()

router.post("/login",adminController.adminVerify)
router.get("/getAdmin",adminController.getAdmin)




module.exports = router