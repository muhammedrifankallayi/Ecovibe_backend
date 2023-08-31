const {Router}  = require("express")

const adminController = require("../controllers/adminController")
const resortController = require("../controllers/resortController")

const router = Router()

router.post("/login",adminController.adminVerify)
router.get("/getAdmin",adminController.getAdmin)
router.get("/getresortdata",adminController.getresort)
router.get("/getresort",resortController.getResort)
router.post("/saveaboutdata",resortController.saveResortData)
router.post("/restaurantdata",resortController.saveRestaurent)
router.get("/getrestaurants",resortController.getRestaurants)




module.exports = router