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

// app.get("/user",(req,res)=>{
//   res.send({firstname :"Siddharth", lastname:"Kasera"})
// })

// app.post("/user",(req,res)=>{
//   res.send("data is successfually send");
// })

// app.delete("/user",(req,res)=>{
// res.send("data deleted");
// })


// app.use("/test",(req,res)=>{
//   res.send("tessssting");
// })

// app.get ("/a/",(req, res)=>{
//   res.send({Firstname:"Sidd",Lastname:"kas"});
// })

//this is how you read the querry perameters
//in postman http://localhost:3000/user?userid=101&technic= mart 
//& this is using for adding more
app.get ("/user",(req, res)=>{
  console.log(req.query)
  res.send({Firstname:"Sidd",Lastname:"kas"});
})

// now how to handel this 
//how to get the user id 
//user perams to get the user id 
//http://localhost:3000/user/707 if you hit the send so you get the userid 
// app.get("/user/:userid",(req,res)=>{
//   console.log(req.params );
//   res.send({FN:"shin",LM:"kuma"})
// })

//http://localhost:3000/user/707/Shin
app.get("/user/:userid/:name/",(req,res)=>{
  console.log(req.params );
  res.send({FN:"shin",LM:"kuma"})
})

app.get("/user",(req,res)=>{
  console.log(query)
  res.send({FN:"shin",LM:"kuma"})
})


app.listen(3000,()=>{
  console.log("here is the serve");
});



