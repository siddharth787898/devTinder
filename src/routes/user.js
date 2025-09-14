const express = require('express');
const { userAuth } = require('../middleware/auth');
const { status } = require('express/lib/response');
const userRouter = express.Router();
const connectionRequest = require("../models/connectionRequest")
const User = require("../models/user"); 



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
//.....................................................................................
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
//.....................................................................................


userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) ||1;
    let limit = parseInt(req.query.limit)||10;
    limit = limit>50 ? 50 : limit;
    const skip = (page-1)*limit;

    // find all the connection requests (sent + received)
    const requests = await connectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id }, // requests I sent
        { toUserId: loggedInUser._id }    // requests I received
      ]
    }).select("fromUserId toUserId");

    // store all userIds I should hide from the feed
    const hideUserFromFeed = new Set();
    requests.forEach((req) => {
      hideUserFromFeed.add(req.fromUserId.toString());
      hideUserFromFeed.add(req.toUserId.toString());
    });

    // find all users not in hideUserFromFeed and not me
    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUserFromFeed) } },
        { _id: { $ne: loggedInUser._id } }
      ]
    })
    .select(USER_SAFE_DATA)
    .skip(skip)
    .limit(limit);

    res.send({ data:users});
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = userRouter;
