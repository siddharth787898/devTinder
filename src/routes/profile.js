import { Router } from "express"; // Import Router from express
import bcrypt from "bcrypt";
import validator from "validator";
import { userAuth } from "../middleware/auth.js"; // Use named import
import { validateEditProfileData } from "../utils/validation.js"; // Add .js extension

const profileRouter = Router();

// GET PROFILE
profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(404).send("error: " + err.message); // Added colon for clarity
  }
});

// EDIT PROFILE
profileRouter.patch("/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req.body)) { // Pass req.body to the validator
      return res.status(400).json({ error: "Invalid edit request" });
    }
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();
    res.json({
      message: `${loggedInUser.firstName}, your profile was updated successfully ✅`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// FORGET PASSWORD or CHANGE PASSWORD
profileRouter.post("/forgetPassword", userAuth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const loggedInUser = req.user;
    
    // 1. Validate request
    if (!oldPassword || !newPassword) {
      throw new Error("Both old and new password are required");
    }
    
    // 2. Validate old password
    const isPasswordValid = await bcrypt.compare(oldPassword, loggedInUser.password);
    if (!isPasswordValid) {
      throw new Error("Old password is incorrect");
    }
    
    // 3. Validate new password strength
    if (!validator.isStrongPassword(newPassword)) {
      throw new Error("New password is not strong");
    }
    
    // 4. Hash the new password
    const newHashPassword = await bcrypt.hash(newPassword, 10);
    
    // 5. Update and save
    loggedInUser.password = newHashPassword;
    await loggedInUser.save();
    
    res.json({ message: "Password updated successfully ✅" });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

export default profileRouter; // Use export default for the router