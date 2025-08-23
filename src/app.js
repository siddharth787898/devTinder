const express = require("express");
const app = express();

// app.use("/",(req,res)=>{
//   res.send("heloo i am here")
// })


// app.use("/hello",(req,res)=>{
//   res.send("helo helo helo");
// })

// app.use("/helo",(req,res)=>{
//   res.send("inside helo");
// })
//

//tthe order matters if i do then this will give me the hahah no matter what api call iam making   main koi se bhi api call kru mujhe sirf hahaha he milega 

// app.use("/",(req,res)=>{
//   res.send("hahaha");
// })

//this method will only match, get api calls to the rout /user

app.get("/user",(req,res)=>{
  res.send({firstname :"Siddharth", lastname:"Kasera"})
})

app.post("/user",(req,res)=>{
  res.send("data is successfually send");
})

app.delete("/user",(req,res)=>{
res.send("data deleted");
})


app.use("/test",(req,res)=>{
  res.send("tessssting");
})

app.listen(3000,()=>{
  console.log("here is the serve");
});



