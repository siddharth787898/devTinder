const express = require("express");
const app = express()
const connectDB =require("./config/database")
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth")



const profileRouter = require("./routes/profile")
const requestRouter = require("./routes/request")
const userRouter = require("./routes/user");

console.log("📦 Importing userRouter...");
//const userRouter = require("./routes/user");
console.log("🛠️ userRouter imported successfully");


//midelware
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/auth",authRouter);
app.use("/profile",profileRouter);
app.use("/request",requestRouter)
 app.use("/user", userRouter);


connectDB()

  .then(()=>{
    console.log("database is established")
    app.listen(3000,()=>{
  console.log("here is the serve");
});
  }).catch(()=>{
    console.error("database is not established")
  })





