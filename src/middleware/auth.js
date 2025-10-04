import jwt from "jsonwebtoken";
import User from "../models/user.js"; // ✅ Add the .js extension

const JWT_SECRET = "DEV@Tinder$790";

const userAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
     return res.status(401).send("Plese login")
    }

    const decodeObj = jwt.verify(token, JWT_SECRET); // ✅ Remove 'await'
    const { _id } = decodeObj;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

export { userAuth }; // ✅ Use a named export