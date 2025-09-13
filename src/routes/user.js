const express = require('express');
const { userAuth } = require('../middleware/auth');
const { status } = require('express/lib/response');
const userRouter = express.Router();
const connectionRequest = require("../models/connectionRequest")

// //get all the pending connectionRequest from loggedInuser
// userRouter.get("/user/request/recive",userAuth,async(req,res)=>{
//   try{
//     //make sure the loggedinuser
//     const loggedInuser = req.user

//     //make get call form the DB and get all the connectionRequest of this loggedinUSer
//   const requests = await connectionRequest.find({
//   toUserId: loggedInUser._id,
//   status: "interested"
// }).populate("fromUserId", ["firstName", "lastName"]);

// res.json({
//   message:"DATA FATCHED SUCCESSFULLY",
//   data: requests
// })
    
    
//   }catch(err){
//     res.status(404).json({ error: err.message}) ;
// }
// })


const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills"

// // Get all pending connection requests for logged-in user
userRouter.get("/request/receive", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const requests = await connectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested"
    }).populate("fromUserId", "firstName lastName"); 

    res.json({
      message: "DATA FETCHED SUCCESSFULLY",
      data: requests
    });

  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});



userRouter.get("/connection", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const requests = await connectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" }
      ]
    }).populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA) ;

    const data = requests.map(row => {
  // if logged-in user is fromUserId, show toUserId, else show fromUserId
  return row.fromUserId._id.equals(loggedInUser._id) ? row.toUserId : row.fromUserId;
});

    res.json({ data });
  } catch (err) {
    res.status(400).send("error: " + err.message);
  }
});

module.exports = userRouter;
