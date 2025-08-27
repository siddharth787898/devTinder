const express = require("express");
const connectDB =require("./config/database")
const app = express();
const User = require("./models/user")

app.use(express.json());
/*
// app.post("/signup", async (req, res) =>{
//   //creating a new instance
//   const user = new User({
//     firstName: "sachin",
//     lastName: "tandulkar",
//     email: "sachhin@kiyoma.com",
//     password:"sachin@123"
//    // i want this data to be send inside the api while i am making post call
//    //is data ko api ke through sed krna hai aur server pr lana hai 
//   });
*/



app.post("/signup", async (req, res) =>{
  //creating a new instance
  //remember use captail U
 const user = new User(req.body);


  try{
  await user.save();
  res.send("user added successfully");
  }catch(err){
   res.status(400).send("Error saving the user");
  }
});

connectDB()

  .then(()=>{
    console.log("database is established")
    app.listen(3000,()=>{
  console.log("here is the serve");
});
  }).catch(()=>{
    console.error("database is not established")
  })





