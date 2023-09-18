const User = require("../models/UserModel")
const jwt       =     require("jsonwebtoken")
const nodemailer = require("nodemailer")
const bcrypt    = require("bcrypt")
const Resort = require("../models/resortModel")
const Subscriptions = require("../models/subscriptionModel")
const Notifications = require("../models/notificationModel")
const Sales = require("../models/superAdminsalesModel")
const WishList  = require("../models/wishListModel")


function tokenReader(token){
  const decoded = jwt.verify(token, 'secret');
  return decoded._id
}


//  funtion for generating random digits

function generateOTP() {
    const min = 100000; 
    const max = 999999; 
  
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  
    return randomNumber;
  }
  
  


  //  node mailer otp sender function

function sendotp(Email , otp) {
    
  
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user:"esample157@gmail.com",
            pass:"iuziufkscrlclcjv"
        }
    });
    const mailOptions = {
        from: 'esample157@gmail.com',
        to: Email,
        subject: 'Your OTP code',
       html: `
    <html>
      <head>
        <style>
          /* Define your inline CSS styles here */
          body {
            font-family: Arial, sans-serif;
          }
          h1 {
            color: #007BFF;
          }
          p {
            margin-bottom: 10px;
          }
          .otp-code {
            font-size: 24px;
            font-weight: bold;
            color: #FF5733;
          }
        </style>
      </head>
      <body>
        <h1>Your OTP Code</h1>
        <p>Your OTP code is: <span class="otp-code">${otp}</span>.</p>
        <p>Please use this code to complete your verification.</p>
      </body>
    </html>
  `

    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {

            console.log(`Email sent: ${info.response}`);
        }
    });
}


   //   register data submitting 


const Postregister = async(req,res)=>{




    try {
      const name   = req.body.userName
      const email  = req.body.email
      const mobile = parseInt(req.body.mobile)
      const password = req.body.password
const userExist = await User.findOne({email:email})

if(userExist){
    return res.status(400).send({
   message : 'user already exist'
    })
}else{
    const user = new User({
        name:name,
        email:email,
        mobile:mobile,
        password:password,
        Date: new Date()
     })

 const result  =  await user.save()

 const {_id} =  await result.toJSON()

 const token  = jwt.sign({_id:_id},"secret")
 
 var otp  = generateOTP()

 



 sendotp(result.email,otp);



 res.status(200).send({otp:otp,token})

 }

    } catch (error) {
        console.log(error.message);
    }
}

const  ValidateLOgin = async(req,res)=>{
    try {
       const FormData = req.body.FormData
        const email  = FormData.email
        const Password = FormData.password
        const UserData = await User.findOne({email:email})

if(UserData.is_blocked===true){
    return res.status(401).send({message:"user blocked"})
}


        if(UserData){
            
            if(Password===UserData.password){
                const {_id} =  await UserData.toJSON()

 const token  = jwt.sign({_id:_id},"secret")
 
 
             res.status(200).send({message:"success",user:UserData.name,token})
               
                
            }else{
              

          res.status(401).send({message:"Password is not correct"})
            
            }
        }
       
        res.status(401).send({message:"User Not Found"})
    } catch (error) {
        console.log("Error",error);
    }
}

const Authenticate = async(req,res)=>{

  const token = req.headers.authorization?.split(" ")[1];
 
  // Get the token from the header
 
  
    try {

      if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.',Authorization:false });
      }

      const decoded = jwt.verify(token,'secret'); // Verify and decode the token
     if(decoded){
        return res.status(200).json({ message: 'User Authentication has been successfull',Authorization:true });
     }
    } catch (error) {
      res.status(400).json({ message: 'Invalid token.' });
    }
  }


  const getUser = async(req,res)=>{
    try {
   
      
      const token = req.headers.authorization?.split(" ")[1];
if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.',Authorization:false });
  }

  const decoded = jwt.verify(token, 'secret'); 

  if(decoded){
    const id = decoded._id

  const user = await User.findById({_id:id})
    res.status(200).json({user})
  }

    } catch (error) {
        console.log(error.message);
    }
  }


const verifyuser = async(req,res)=>{
    try {


       const token = req.body.data

     

       await User.findOneAndUpdate({email:token},{$set:{is_verified:true}})
       res.status(200).send({message:"verification submitted"});
   
    } catch (error) {
        console.log(error.message);
    }
}


const saveReq = async(req,res)=>{
  try {
      
 const data = req.body.data
 const userId = req.user_id
const resortSave = new Resort({
  hoster_id: userId,
  resortName:data.resortName,
  resortAdress:data.address,
  resort_type:data.type,
  location:data.location,
  mobile:data.mobile,
  email:data.email,
  occupency:data.occupency,
  date: new Date()
  
})

await resortSave.save()

 res.status(200).send({message:"data submitted successfull.."})   

  } catch (error) {
    console.log(error.message);
  }
}

const forgetotp  = async(req,res)=>{
  try {
const email = req.query.email
const otp = generateOTP()
sendotp(email,otp)

res.status(200).send({otp})



  } catch (error) {
    console.log(error.message);
  }

}


const updatePassword = async(req,res)=>{
  try {

    const email = req.body.email
    const password = req.body.password
    await User.findOneAndUpdate({email:email},{$set:{password:password}})

    res.status(200).send({massage:"password updated"})
    
  } catch (error) {
    console.log(error.message);
  }
}

const getSubscriptions = async(req,res)=>{
  try {
    
  const data = await Subscriptions.find({is_list:true})

  res.status(200).send({data})


  } catch (error) {
    console.log(error.message);
  }
}
const subscriptionPurchase = async(req,res)=>{
  try {

    const subData = req.body.data
    const paymentId = subData.payment_id
    const subscriptionId = subData.id
    const userId  =   subData.userId?subData.userId:req.user_id


const data = await User.findById({_id:userId})
const subscriptionData = await Subscriptions.findOne({_id:subscriptionId})
const resort = await Resort.findOne({hoster_id:userId})

const duration = parseInt(subscriptionData.duration)
const type = subscriptionData.type
const today = new Date()
const expireDate = await dateCalculate(duration,type)
const sale = new Sales({resortId:resort._id,subscriptionId:subscriptionData._id,type:subscriptionData.type,price:parseInt(subscriptionData.price),payment_id:paymentId})

if(data.is_admin===true){
await sale.save()
await Resort.findOneAndUpdate({hoster_id:userId},{$set:{subcription_Date:today,subcription_End:expireDate}}).then(()=>{

  res.status(200).json({message:"Subscription purchased successfully"})
})
  
}else{
  res.status(400).send({message:"you are not approved to be a admin, send permission for hosting "})
}
  } catch (error) {
    console.log(error.message);
  }
}

function dateCalculate(duration, type) {
  var today = new Date();

  if (type === 'Monthly') {
    var futureDate = new Date(today);
    futureDate.setMonth(today.getMonth() + parseInt(duration));
    return futureDate;
  } else {
    var futureDate = new Date(today);
    futureDate.setFullYear(today.getFullYear() + parseInt(duration));
    return futureDate;
  }



}

const isAdmin = async(req,res)=>{
  try {
    const userId = req.query.id? req.query.id : req.user_id
    const data = await User.findById({_id:userId})

    if(data.is_admin!==true){
      res.status(400).send({message:"you are not approved to be a admin, send permission for hosting "})

    }else{
      res.status(200).send({message:"success"})
    }

    

  } catch (error) {
    console.log(error.message);
  }
}

const notification = async(req,res)=>{
  try {
    
const userId = req.user_id
const Notifydata = await Notifications.findOne({user_id:userId})

const data = Notifydata.notification

res.status(200).send({data})




  } catch (error) {
    
  }
}

const notifiLength = async(req,res)=>{
  try {
     const notification = await Notifications.aggregate([
      {
        $match: {
          user_id: req.user_id, // Match documents with the specified user_id
        },
      },
      {
        $unwind: '$notification', // Deconstruct the notification array
      },
      {
        $match: {
          'notification.is_view': false, // Match documents where is_view is false
        },
      },
      {
        $group: {
          _id: '$_id', // Group by the document's _id
          count: { $sum: 1 }, // Calculate the count of matching notifications
        },
      },
    ])
res.status(200).send({count:notification[0].count})




  } catch (error) {
    console.log(error.message);
  }
}



const editProfile = async(req,res)=>{
  try {
const data = req.body.data
    const user_id = req.user_id
    await User.findByIdAndUpdate({_id:user_id},{$set:{
      name:data.name,
      email:data.email,
      mobile:data.mobile,
      age:data.age
    }}).then(()=>res.status(200).send({message:"successfully saved"}))
    
  } catch (error) {
    console.log(error.message);
  }
}

const userProfileImage = async(req,res)=>{
  try {
    
   const userId = req.user_id
console.log(req);
   await User.findByIdAndUpdate({_id:userId},{$set:{profile_img:req.file.filename}})
   res.status(200).send({message:"image updated"})

  } catch (error) {
    console.log(error.message);
  }
}

const addToWhishList = async(req,res)=>{
  try {
    const userid = req.user_id
    const resortid = req.body.id
     const data = {resortId:resortid}
     const wishData = await WishList.findOne({userId:userid})
     


     
     if(wishData ){

     
  const isAdded = wishData.List.map((val)=>{
    return val.resortId === resortid
  })

  if(isAdded[0]){
    console.log(isAdded);
    return res.status(400).send({message:"already added"})
  }

      await WishList.findOneAndUpdate({userId:userid},{$push:{List:data}}).then(()=>{
        res.status(200).send({message:"added to wishlist"})
      })
     }else{
      const wishlist = new WishList({
        userId:userid,
        List:[data]
       })
   
       await wishlist.save().then(()=>{
         res.status(200).send({message:"added to wishlist"})
       })
     }
   


  } catch (error) {
    console.log(error.message);
  }
}


const getWishList = async(req,res)=>{
  try {
    
 const user_id = req.user_id

 const data = await WishList.findOne({userId:user_id}).populate("List.resortId")
 console.log(data);
 res.status(200).send(data.List)

  } catch (error) {
    console.log(error.message);
  }
}


const removeWhishlist = async(req,res)=>{
  try {

   
    await WishList.findOneAndUpdate({userId:req.user_id},{$pull:{List:{resortId:req.body.id}}}).then(()=>{
      res.status(200).send({message:"Removed from wishlist"})
    },(err)=>{
  res.status(400).send({err})
    })
  } catch (error) {
    console.log(error.message);
  }
}

module.exports = {
    Postregister,
    ValidateLOgin,
    Authenticate,
    getUser,
    verifyuser,
    saveReq,
    forgetotp,
    updatePassword,
    getSubscriptions,
    subscriptionPurchase,
    isAdmin,
    notification,
    notifiLength,
    editProfile,
    userProfileImage,
    addToWhishList,
    getWishList,
    removeWhishlist
}