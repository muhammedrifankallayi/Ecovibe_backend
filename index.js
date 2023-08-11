const express = require('express');
const mongoose = require('mongoose')
const cookieparser = require("cookie-parser")
const bodyParser = require("body-parser")
const cors = require('cors');
const UserRote = require("./routes/userRout")


const app = express()


app.use(cors({
    credentials:true,
    origin:["http://localhost:4200"]
}))
app.use(cookieparser())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.json())


app.use("/",UserRote.router)





mongoose.connect("mongodb://127.0.0.1:27017/Ecovibe").then(() => {
  console.log("Connected to MongoDB");
  app.listen(4000, () => {
    console.log("Server started on port 4000");
  });
}).catch(err => {
  console.error("Error connecting to MongoDB:", err);
});

