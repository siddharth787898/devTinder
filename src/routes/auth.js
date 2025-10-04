import { Router } from "express"; // Import Router, not the whole express app
import { validateSignupData } from "../utils/validation.js"; // Add .js extension
import User from "../models/user.js"; // Add .js extension
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Use 'const' to declare the router
const authRouter = Router();
const JWT_SECRET = "DEV@Tinder$790";

authRouter.post("/signup", async (req, res) => {
  // your existing code...
  try {
    console.log("Incoming body:", req.body);
    validateSignupData(req.body)
    const { firstName, lastName, email, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10)
    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    })

    const saveUser = await user.save();
    const token = await saveUser.getJWT();
      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
      });
    res.json({message:"User Added Successfully",data:saveUser});
  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(400).send(err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    console.log("Req body:", req.body);
    const { email, password } = req.body;
    const user = await User.findOne({ email }); 
    
   
    if (!user) {
      return res.status(400).json({ error: error.message });
    }
    
    // ✅ You need to ensure 'validatePassword' is a method on your user model
    const isPasswordValid = await user.validatePassword(password);
    
    if (isPasswordValid) {
      const token = await user.getJWT();
      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
      });
      // ✅ Send a JSON response instead of plain text
      return res.status(200).json(user);
    } else {
      // ✅ Handle the "invalid password" case with a proper JSON response
      return res.status(400).json({ error: "password is not valid" });
    }
  } catch (err) {
    // ✅ Catch and handle any unexpected errors with a 500 status code
    console.error(err);
    res.status(500).json({ err: "An internal server error occurred." });
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now())
  });
  res.send("logout successfully")
})

export default authRouter;