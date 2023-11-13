const express = require('express');
const mongoose = require('mongoose')
const cookieparser = require("cookie-parser")
const bodyParser = require("body-parser")
const cors = require('cors');
const UserRoute = require("./routes/userRout")
const session = require("express-session");
const adminRoute = require("./routes/adminRout")
const superAdminRoute = require("./routes/superAdmin")
const initializeSocket= require("./middlewares/socket.io")
const app = express()
const http = require('http').createServer(app); 
const dotenv = require("dotenv")
dotenv.config()
app.use(session({
  secret: process.env.SESSION,
  resave: false,
  saveUninitialized: true
}));

app.use(cors({
  origin:'*',
  credentials:true
}))
app.use(cookieparser())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.json())



app.use("/",UserRoute)
app.use("/admin",adminRoute)
app.use("/superAdmin",superAdminRoute)

app.use('/public', express.static('./public/resort_img'));






mongoose.connect(process.env.DATABASE).then(() => {
  console.log("Connected to MongoDB");

}).catch(err => {
  console.error("Error connecting to MongoDB:", err);
});
const server = http.listen(process.env.PORT, () => {
  console.log("Server started listening to port");

});

initializeSocket(server)