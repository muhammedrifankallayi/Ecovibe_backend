const {Router} = require("express")
const superAdminController = require("../controllers/superAdminController")

const router = Router()

router.post("/login",superAdminController.VerifySuper)
router.get("/getUser",superAdminController.getUser)
router.post("/blockUser",superAdminController.blockUser)
router.get("/getRequests",superAdminController.getRequest)
router.patch("/approveRequest/:id",superAdminController.approveRequest)
router.patch("/rejectRequest/:id",superAdminController.rejectRequest)





module.exports = router





