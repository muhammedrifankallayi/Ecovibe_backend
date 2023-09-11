const User = require("../models/UserModel")
const jwt       =     require("jsonwebtoken")
const nodemailer = require("nodemailer")
const bcrypt    = require("bcrypt")
const Resort = require("../models/resortModel")


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
console.log("works");
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
 
 console.log(token);
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
 
  console.log(token); 
  
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
   
      console.log("works");
      console.log(req.headers);
      const token = req.headers.authorization?.split(" ")[1];
if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.',Authorization:false });
  }

  const decoded = jwt.verify(token, 'secret'); 

  if(decoded){
    const id = decoded._id

    console.log(id+"this is my id ");
  const user = await User.findById({_id:id})
  console.log(user);
    res.status(200).json({user})
  }

    } catch (error) {
        console.log(error.message);
    }
  }


const verifyuser = async(req,res)=>{
    try {

console.log("works verify");

        console.log(req.body)
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
 const userId = tokenReader(req.body.token)
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
console.log("otp sed");

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
console.log("updated");
    res.status(200).send({massage:"password updated"})
    
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
    updatePassword
}