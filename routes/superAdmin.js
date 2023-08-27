const {Router} = require("express")
const superAdminController = require("../controllers/superAdminController")

const router = Router()

router.post("/login",superAdminController.VerifySuper)
router.get("/getUser",superAdminController.getUser)
router.post("/blockUser",superAdminController.blockUser)
router.get("/getRequests",superAdminController.getRequest)
router.patch("/approveRequest/:id",superAdminController.approveRequest)
router.patch("/rejectedRequest/:id",superAdminController.rejectRequest)
router.post("/savesubscription",superAdminController.saveSubscription)
router.get("/getsubscription",superAdminController.getSubscription)





module.exports = router





