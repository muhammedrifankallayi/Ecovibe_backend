const {Router} = require("express")
const superAdminController = require("../controllers/superAdminController")

const router = Router()

router.post("/login",superAdminController.VerifySuper)
router.get("/getUser",superAdminController.getUser)
router.post("/blockUser",superAdminController.blockUser)





module.exports = router





