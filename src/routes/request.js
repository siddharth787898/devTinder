const express = require("express");
const requestRouter = express.Router();
const User = require("../models/user")

const { userAuth } = require("../middleware/auth");
const connectionRequest = require("../models/connectionRequest");
//const { matches } = require("validator");
//const connectionRequestModel = require("../models/connectionRequest");

// requestRouter.post("/sendconnection", userAuth, async (req, res) => {
//   const user = req.user;
//   console.log("Sending connection request");
//   res.send(user.firstName + " sent the connection request");
// });

requestRouter.post("/request/send/:status/:toUserId", userAuth,async(req,res)=>{
try{
  const fromUserId = req.user._id;
  const toUserId = req.params.toUserId;
  const status = req.params.status;

  const allowedStatus =["ignored", "interested"];
  if(!allowedStatus.includes(status)){
    return res.status(400).json({
      matches:"INVALID STATUS TYPE"+status
    });
  };
    
  const toUser = await User.findById(toUserId);
  if(!toUser){
    return res.json({
      massage:"USER NOT FOUND"
    })
  }

     const existingConnectionRequest = await connectionRequest.findOne({ 
      $or:[
        {fromUserId,toUserId},
        {fromUserId:toUserId,toUserId:fromUserId}
      ]
    });


    if(existingConnectionRequest){
      return res.status(400).send({
        message:"CONNECTION REQUEST ALREDY EXIST!"
      });
    }

    const ConnectionRequest = new connectionRequest({
      fromUserId,
      toUserId,
      status
    })
    const data = await ConnectionRequest.save(); 

    res.json({
      message: req.user.firstName + " is " + status + " in " + toUser.firstName,
      data
    });
  } catch (err) {
    res.status(400).send("error: " + err.message); 
  }
});

requestRouter.post("/review/:status/:requestId",userAuth,async(req,res)=>{
  try{
    const loggedInuser = req.user
    const{status,requestId}=req.params
    
    const allowedStatus =["accepted","rejected"];
   if (!allowedStatus.includes(status)) {
  return res.status(400).json({ message: "STATUS NOT ALLOWED" });
}

// const connectionRequest = await connectionRequest.findOne({
//   _id:requestId,
//   toUserId:loggedInuser,
//   status:"interested"
// })
// if(!connectionRequest){
//   return res.status(404).json({message:"CONNECTION REQUEST NOT FOUND"})
// }
//  connectionRequest.status = status

//  const data = await connectionRequest.save()
    // ✅ Use model name properly and match spelling of "interested"
    const request = await connectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInuser._id,   // must be _id, not full user object
      status: "interested"
    });

    if (!request) {
      return res.status(404).json({ message: "CONNECTION REQUEST NOT FOUND" });
    }

    request.status = status;
    const data = await request.save();

 res.json({
  message:"ConnectionRequest"+status,data
 })

  }catch(err){
    res.status(404).json({ error: err.message}) ;
}
  })


module.exports = requestRouter;