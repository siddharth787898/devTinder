const res = require("express/lib/response");
const jwt = require("jsonwebtoken");
const User = require("../models/user");



const JWT_SECRET = "DEV@Tinder$790";

// const userAuth = async(req, res, next)=>{
//   //read the token from the req cookies
//   //validate the token
//   //find the user
// try{
//   //rread the token
//   const token = req.cookies;// i got the token fom cookies
//   if(!token){
//     throw new Error("Invalid Token")
//   }
// // how do you veryfy this
// //veryfing the token
// const decodeObj = await jwt.verify(token,JWT_SECRET)    //import the jasonweblibrary

// //geting my _id from decodeObj
// const{_id}= decodeObj
// //find the user in my database
// const user = await User.findById(_id) //import ("./models/user")
// if(!user){
//   throw new Error("user not found")
// }
// next() // if the token is valied and user is found then cal the nnext()
// }catch(error){
//   res.status(400).send("Error"+error.message);
// }
// }

const userAuth = async(req,res,next)=>{
  try{
    const token = req.cookies.token;   // 👈 not whole object, just token
  if(!token){
    throw new Error("Invalied token")
  }
  
const decodeObj = await jwt.verify(token,JWT_SECRET)
const{_id}= decodeObj
const user = await User.findById(_id)
if(!user){
  throw new Error("user not found")
}
    req.user = user;   // 👈 must be here
next()
}catch (error) {
    res.status(401).json({ error: error.message }); 
  }
}
  




module.exports={
userAuth
}