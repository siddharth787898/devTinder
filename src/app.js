const express = require("express");
const connectDB =require("./config/database")
const app = express();
const User = require("./models/user")
const {validateSignupData}= require("./utils/validation")
const bcrypt = require("bcrypt")
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const {userAuth}= require("./middelware/auth");

app.use(express.json());
app.use(cookieParser());




//...............post Signup.........................................
app.post("/signup", async (req, res) =>{
 
 //what i am doing i am creating the password 
  try{
      console.log("Incoming body:", req.body); 
    //vaidate the data 
    // i am validating the signup data 
    validateSignupData(req.body)
// i am extracting this fileds out 
    const{firstName, lastName, email,password}=req.body;

    //encript the password 
   const passwordHash= await bcrypt.hash(password,10)

   const user = new User({
    firstName, 
    lastName, 
    email,
    password:passwordHash,})

  await user.save();
  res.send("user added successfully");
  }catch (err) {
    console.error("Signup error:", err.message);
    res.status(400).send(err.message);
  }
});

//post login.............................................................................
const JWT_SECRET = "DEV@Tinder$790";

app.post("/login",async(req,res)=>{
  try{
     console.log("Req body:", req.body);
const {email,password}= req.body;

const user = await User.findOne({email:email})
if(!user){
  throw new Error("email is not present in DB")
}
const isPasswordValid = await user.validatePassword(password)
if(isPasswordValid){

const token = await user.getJWT()
console.log(token)

res.cookie("token", token, {
  expires: new Date(Date.now()+ 8 * 3600000),
   httpOnly: true })
//res.cookie("token",token)

res.send("login successfuly") 
}else{
  throw new Error ("password is not vaild")
}
}catch(error){
  res.status(404).send("error"+error.message)
}
})

//............................................................................


//get profife
app.get("/profile",userAuth,async(req,res)=>{

  try{ 
const user = req.user

  res.send(user);
}catch(err){
res.status(404).send("error"+err.message)
}}
 )

 // sendconnectin resquest................................................................
 app.post("/sendconnection",userAuth, async(req,res)=> {
  const user = req.user
  //sinding the connection request
  console.log("Sending connection request")
  res.send(user.firstName+"sent the connect request")
 })



connectDB()

  .then(()=>{
    console.log("database is established")
    app.listen(3000,()=>{
  console.log("here is the serve");
});
  }).catch(()=>{
    console.error("database is not established")
  })





