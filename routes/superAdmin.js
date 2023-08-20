const {Router} = require("express")
const superAdminController = require("../controllers/superAdminController")

const router = Router()

router.post("/login",superAdminController.VerifySuper)
router.get("/getUser",superAdminController.getUser)





module.exports = router





