const express = require("express")
const profileRouter = express.Router();
const bcrypt = require("bcrypt")
const validator = require("validator");
const {userAuth}= require("../middleware/auth.js");
const{validateEditProfileData} = require("../utils/validation.js")



//get profife
profileRouter.get("/profile",userAuth,async(req,res)=>{

  try{ 
const user = req.user

  res.send(user);
}catch(err){
res.status(404).send("error"+err.message)
}}
 )

 //EDIT PROFILE
profileRouter.patch("/edit",userAuth,async(req,res)=>{
  try{
  if(!validateEditProfileData(req)){
    throw new Error("Invalid edit request")
  }
  const loggedInUser = req.user
  console.log(loggedInUser)
  Object.keys(req.body).forEach((key)=>(loggedInUser[key]=req.body[key]));
  await loggedInUser.save();
  console.log(loggedInUser)
  res.json({
    message:`${loggedInUser.firstName},YOUR PROFILE UPDATE SUCCESSFULLY`,
    data: loggedInUser
  })
 
  }catch(err){
    res.status(400).json({ error: err.message });  // ✅ send error response
  }
})

//FORGET PASSWORD or CHANGE PASSWORD

profileRouter.post("/forgetPassword",userAuth,async(req,res)=>{
  try{
    const {oldPassword, newPassword}= req.body;
    const loggedInUser = req.user
    //1 validate a request 
    if(!oldPassword|| !newPassword){
      throw new Error ("Both old and new password required")
    }
    //2.validate the old password
    const isPasswordValid = await bcrypt.compare(
      oldPassword, 
      loggedInUser.password
    );
    if(!isPasswordValid){
      throw new Error ("old password is incorrect")
    }
    //3.validate the new password strength
       if (!validator.isStrongPassword(newPassword)) {
      throw new Error("New password is not strong");
    }
    //4. hash the new password
    const newHashPassword = await bcrypt.hash(newPassword,10)
    //5. updatw and save
    loggedInUser.password = newHashPassword
    await loggedInUser.save();
   res.json({ message: "Password updated successfully ✅" });
  }catch(err){
    res.status(400).send("Error"+err.message)
  }
})

 module.exports = profileRouter