const jwt  = require("jsonwebtoken")

const decoder =  async(req, res,next) => {
 
    try {
       
         const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token,'secret'); 
      req.user_id = decoded._id
    
    } catch (error) {
        console.log(error.message);
      return res.status(400).json({ error: 'Invalid header format' });
    }

    next()
  
}

const adminDecoder = async(req,res,next)=>{
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token,'adminsecret'); 
      req.admin_id = decoded._id
   
    
  } catch (error) {
    console.log(error.message);
  }
  next()
}

module.exports = {
    decoder,
    adminDecoder
}