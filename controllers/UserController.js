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


const verifyuser = async(req,res)=>{
    try {

        console.log(req.body.data);
       const token = req.body.data

       const encoded = jwt.verify(token,'secret')
       const id = encoded._id

       await User.findByIdAndUpdate({_id:id},{$set:{is_verified:true}})
       res.status(200).send({message:"verification submitted"});
   
    } catch (error) {
        console.log(error.message);
    }
}



module.exports = {
    Postregister,
    ValidateLOgin,
    Authenticate,
    getUser,
    verifyuser
}