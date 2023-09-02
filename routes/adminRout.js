const {Router}  = require("express")

const adminController = require("../controllers/adminController")
const resortController = require("../controllers/resortController")
const multer = require("multer")
const path = require("path")

const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, path.join(__dirname,'../public/resort_img'))
    },
    filename: (req, file, callBack) => {
        callBack(null, `Ecovibe_img_${file.originalname}`)
    }
  })
  
const upload = multer({ storage: storage })








const router = Router()

router.post("/login",adminController.adminVerify)
router.get("/getAdmin",adminController.getAdmin)
router.get("/getresortdata",adminController.getresort)
router.get("/getresort",resortController.getResort)
router.post("/saveaboutdata",resortController.saveResortData)
router.post("/restaurantdata",resortController.saveRestaurent)
router.get("/getrestaurants",resortController.getRestaurants)
router.post("/surroundingdata",resortController.saveSurrounding)
router.post("/itemsurrdata",resortController.saveitemsToSurroundings)
router.get("/getsurroundings",resortController.getSurroundings)
router.post("/deletesurrounding",resortController.deleteSurrounding)
router.patch("/deleterestaurant",resortController.deleteRestaurant)
router.put("/amemtiesdata",resortController.addAmenties)
router.get("/getamenties",resortController.getAmenties)
router.patch("/deleteamenties",resortController.deleteAmenties)
router.post("/submitimages",upload.array("files"),resortController.submitImages)
router.get("/getimages",resortController.getImages)
router.patch("/addToMainImg",resortController.addToMainImage)
router.patch("/addAsBanner",resortController.addAsBanner)
router.patch("/deleteImg",resortController.deleteImg)






module.exports = router