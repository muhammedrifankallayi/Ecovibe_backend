const  multer=require('multer')

const path= require('path')


const storage = multer.diskStorage({
    destination:function(req,file,cb){
        console.log("gggg");
        cb(null,path.join(__dirname,'../public'))

    },
    filename:function(req,file,cb){
           console.log(file);
      const name= Date.now()+'-'+file.originalname
        cb(null,name)
      
    }
})
const imageFilter = function(req, file, cb) {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
    req.fileValidationError = 'Only image files are allowed!';
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

const upload =multer({storage:storage})


module.exports={
    upload
}