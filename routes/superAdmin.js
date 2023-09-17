const {Router} = require("express")
const superAdminController = require("../controllers/superAdminController")
const chartController = require("../controllers/chartsController")


const router = Router()

router.post("/login",superAdminController.VerifySuper)
router.get("/getUser",superAdminController.getUser)
router.post("/blockUser",superAdminController.blockUser)
router.get("/getRequests",superAdminController.getRequest)
router.patch("/approveRequest/:id",superAdminController.approveRequest)
router.patch("/rejectedRequest/:id",superAdminController.rejectRequest)
router.post("/savesubscription",superAdminController.saveSubscription)
router.get("/getsubscription",superAdminController.getSubscription)
router.get("/getresorts",superAdminController.getResorts)
router.patch("/blockresort",superAdminController.blockResort)
router.patch("/unblockresort",superAdminController.unBlock)
router.get("/getChartdata",chartController.AdmincChartData)





module.exports = router





