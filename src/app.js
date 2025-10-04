import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./config/database.js";
import authRouter from "./routes/auth.js";
import profileRouter from "./routes/profile.js";
import requestRouter from "./routes/request.js";
import userRouter from "./routes/user.js";

const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:5173", // 👈 Your frontend URL (Vite default port)
  credentials: true // 👈 Allow cookies/authorization headers
}));
app.use(express.json());
app.use(cookieParser());

// Routes
// ❌ Redundant: app.use("/", authRouter);
app.use("/auth", authRouter); // ✅ This is the correct route definition
app.use("/profile", profileRouter);
app.use("/request", requestRouter);
app.use("/user", userRouter);

connectDB()
  .then(() => {
    console.log("database is established");
    app.listen(7777, () => {
      // ✅ Changed the log message for better confirmation
      console.log("Server is listening on port 7777");
    });
  })
  .catch((err) => {
    console.error("database is not established", err);
  });