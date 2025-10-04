import { Router } from 'express'; // Import Router from express
import { userAuth } from '../middleware/auth.js'; // Use named import
import connectionRequest from '../models/connectionRequest.js'; // Add .js extension
import User from '../models/user.js'; // Add .js extension



const userRouter = Router();

const USER_SAFE_DATA = 'firstName lastName photoUrl age gender about skills';

// Get all pending connection requests for logged-in user
userRouter.get('/request/receive', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const requests = await connectionRequest
      .find({
        toUserId: loggedInUser._id,
        status: 'interested',
      })
      .populate('fromUserId', 'firstName lastName');

    res.json({
      message: 'DATA FETCHED SUCCESSFULLY',
      data: requests,
    });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

// Get all connections (accepted) for logged-in user
userRouter.get('/connection', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const requests = await connectionRequest
      .find({
        $or: [
          { toUserId: loggedInUser._id, status: 'accepted' },
          { fromUserId: loggedInUser._id, status: 'accepted' },
        ],
      })
      .populate('fromUserId', USER_SAFE_DATA)
      .populate('toUserId', USER_SAFE_DATA);

    const data = requests.map((row) => {
      // if logged-in user is fromUserId, show toUserId, else show fromUserId
      return row.fromUserId._id.equals(loggedInUser._id) ? row.toUserId : row.fromUserId;
    });

    res.json({ data });
  } catch (err) {
    res.status(400).json({ error: 'Error: ' + err.message });
  }
});

// Get a feed of users to show as potential matches
userRouter.get('/feed', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const requests = await connectionRequest
      .find({
        $or: [
          { fromUserId: loggedInUser._id },
          { toUserId: loggedInUser._id },
        ],
      })
      .select('fromUserId toUserId');

    const hideUserFromFeed = new Set();
    requests.forEach((req) => {
      hideUserFromFeed.add(req.fromUserId.toString());
      hideUserFromFeed.add(req.toUserId.toString());
    });
    hideUserFromFeed.add(loggedInUser._id.toString()); // Also hide the logged-in user

    const users = await User.find({
      _id: { $nin: Array.from(hideUserFromFeed) },
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.json({ data: users });
  } catch (err) {
    res.status(400).json({ error: 'Error: ' + err.message });
  }
});

export default userRouter;