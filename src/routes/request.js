import { Router } from "express";
import User from "../models/user.js";
import { userAuth } from "../middleware/auth.js";
import connectionRequest from "../models/connectionRequest.js";

const requestRouter = Router();

// Route to handle sending a connection request
requestRouter.post("/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    const allowedStatus = ["ignored", "interested"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "INVALID STATUS TYPE: " + status,
      });
    }

    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(404).json({
        message: "USER NOT FOUND",
      });
    }

    const existingConnectionRequest = await connectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });

    if (existingConnectionRequest) {
      return res.status(400).json({
        message: "CONNECTION REQUEST ALREADY EXISTS!",
      });
    }

    const newConnectionRequest = new connectionRequest({
      fromUserId,
      toUserId,
      status,
    });
    const data = await newConnectionRequest.save();

    res.json({
      message: req.user.firstName + " is " + status + " in " + toUser.firstName,
      data,
    });
  } catch (err) {
    res.status(400).json({ error: "Error: " + err.message });
  }
});

// Route to handle reviewing a connection request (accept/reject)
requestRouter.post("/review/:status/:requestId", userAuth, async (req, res) => {
  try {
    const loggedInuser = req.user;
    const { status, requestId } = req.params;

    const allowedStatus = ["accepted", "rejected"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "STATUS NOT ALLOWED" });
    }

    const request = await connectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInuser._id,
      status: "interested",
    });

    if (!request) {
      return res.status(404).json({ message: "CONNECTION REQUEST NOT FOUND" });
    }

    request.status = status;
    const data = await request.save();

    res.json({
      message: "Connection request " + status,
      data,
    });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

export default requestRouter;