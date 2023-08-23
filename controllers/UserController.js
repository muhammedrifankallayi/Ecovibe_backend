const User = require("../models/UserModel")
const jwt       =     require("jsonwebtoken")
const nodemailer = require("nodemailer")
const bcrypt    = require("bcrypt")


//  funtion for generating random digits

function generateOTP() {
    const min = 100000; 
    const max = 999999; 
  
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  
    return randomNumber;
  }
  
  


  //  node mailer otp sender function

function sendotp(Email) {
    
  var  otp = generateOTP()
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
                background-color: red;
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
 res.cookie("jwt",token,{
     httpOnly:true,
     maxAge:60*60*24*1000
 })
 console.log(token);

 sendotp(result.email);

 res.status(200).send({message:"success",token})

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
 res.cookie("jwt",token,{
     httpOnly:true,
     maxAge:60*60*24*1000
 })
 
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
    const token = req.header('Authorization')?.split(' ')[1]; // Get the token from the header
 
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.',Authorization:false });
    }
  
    try {
      const decoded = jwt.verify(token, 'secret'); // Verify and decode the token
     if(decoded){
        return res.status(200).json({ message: 'User Authentication has been successfull',Authorization:true });
     }
    } catch (error) {
      res.status(400).json({ message: 'Invalid token.' });
    }
  }


  const getUser = async(req,res)=>{
    try {
   
const token =  req.header('Authorization')?.split(' ')[1];
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


module.exports = {
    Postregister,
    ValidateLOgin,
    Authenticate,
    getUser
}