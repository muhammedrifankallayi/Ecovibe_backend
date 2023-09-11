const express = require('express');
const mongoose = require('mongoose')
const cookieparser = require("cookie-parser")
const bodyParser = require("body-parser")
const cors = require('cors');
const UserRoute = require("./routes/userRout")
const session = require("express-session");
const adminRoute = require("./routes/adminRout")
const superAdminRoute = require("./routes/superAdmin")
const jwt = require("jsonwebtoken")

const app = express()
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

app.use(cors({
    credentials:true,
    origin:["http://localhost:4200"]
}))
app.use(cookieparser())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.json())



app.use("/",UserRoute)
app.use("/admin",adminRoute)
app.use("/superAdmin",superAdminRoute)

app.use('/public', express.static('./public/resort_img'));






mongoose.connect("mongodb://127.0.0.1:27017/Ecovibe").then(() => {
  console.log("Connected to MongoDB");
  app.listen(4000, () => {
    console.log("Server started on port 4000");
  });
}).catch(err => {
  console.error("Error connecting to MongoDB:", err);
});

