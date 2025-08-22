const express = require("express");
const app = express();

// app.use("/",(req,res)=>{
//   res.send("heloo i am here")
// })

app.use("/helo",(req,res)=>{
  res.send("inside helo");
})

app.use("/test",(req,res)=>{
  res.send("tessssting");
})

app.listen(3000,()=>{
  console.log("here is the serve");
});



