const express = require("express");
const connectDB =require("./config/database")
const app = express();
const User = require("./models/user")
const {validateSignupData}= require("./utils/validation")
const bcrypt = require("bcrypt")
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

app.use(express.json());
app.use(cookieParser());




app.post("/signup", async (req, res) =>{
 
 //what i am doing i am creating the password 
  try{
    //vaidate the data 
    // i am validating the signup data 
    validateSignupData(req)
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
const isPasswordValid = await bcrypt.compare(password,user.password);
if(isPasswordValid){
//over here i logic for cooki and everything
const token = await jwt.sign({_id: user._id},JWT_SECRET);
console.log(token)
//creat the JWT token

//and the token to cooki and send the response
//as soon as i send the cooki to the user now my user will alredy atunticated its like temperory password

res.cookie("token", token, { httpOnly: true })

res.cookie("token",token)

  res.send("login successfuly") 
}else{
  throw new Error ("password is not vaild")
}
}catch(error){
  res.status(404).send("error"+error.message)
}
})




//get profife
app.get("/profile",async(req,res)=>{
  const cookies = req.cookies;
  
  const{token}= cookies;
  //validate the token
const decodedMassage = await jwt.verify(token,JWT_SECRET)
console.log(decodedMassage)
console.log(cookies)
  res.send("Reading cookie");
})


//get all the feed 
app.get ("/feed",async(req,res)=>{
  try{
const users= await User.find({})
res.send(users)
  }catch{
res.status(404).send("somthing went wrong");
  }
})


// delet a user by id 
app.delete("/user",async(req,res)=>{
  const userId = req.body.userId;
  
  try{
    const user= await User.findByIdAndDelete(userId)
    res.send("deleted success")
  }catch{
res.status(404).send("somthing went wrong");
  }
})

//update the data useingg patch 
app.patch("/user/:userId",async(req,res)=>{
  const userId = req.params.userId;
  const data = req.body;

  try{
    const AllowedUpdate = [  "photoUrl","about","gender","skills","age"]
    const isUpdateAllowed = Object.keys(data).every((k)=>
    AllowedUpdate.includes(k)
  );

    if(!isUpdateAllowed){
      throw new Error ("update is not allowed")
    }
    if (data.skills && data.skills.length > 10) {
  throw new Error("Cannot have more than 10 skills");
}
  
 const user = await User.findByIdAndUpdate({_id:userId},data,{
    //returnDocument:"after",
    new:true,//returnDocument:"after", write this thing like this 
     
    runValidators:true
  })
   res.send("update success")
}catch(err){
   res.status(400).send("Update failed: " + err.message);
  }
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





