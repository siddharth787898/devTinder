const express = require("express")
const authRouter = express.Router()
const app = express();

app.use(express.json());

const {validateSignupData}= require("../utils/validation")
const User = require("../models/user")
const bcrypt = require("bcrypt")

const jwt = require("jsonwebtoken");
const JWT_SECRET = "DEV@Tinder$790";


authRouter.post("/signup", async (req, res) =>{
 
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
authRouter.post("/login",async(req,res)=>{
  try{
     console.log("Req body:", req.body);
const {email,password}= req.body;

const user = await User.findOne({email:email})
if(!user){
  throw new Error("email is not present in DB")
}
const isPasswordValid = await user.validatePassword(password)
if(isPasswordValid){

// const token = await user.getJWT()
// console.log(token)

// res.cookie("token", token, {
//   expires: new Date(Date.now()+ 8 * 3600000),
//    httpOnly: true })
// res.cookie("token",token)

const token = await user.getJWT();   // ✅ user method
res.cookie("token", token, {
  httpOnly: true,
  secure: false,
  sameSite: "strict"
});



res.send("login successfuly") 
}else{
  throw new Error ("password is not vaild")
}
}catch(error){
  res.status(404).send("error"+error.message)
}
})

authRouter.post("/logout",async(req,res)=>{
  res.cookie("token", null,{
    expires: new Date (Date.now())
  });
  res.send("logout successfully")
})



module.exports=authRouter