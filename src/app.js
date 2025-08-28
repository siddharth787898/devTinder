const express = require("express");
const connectDB =require("./config/database")
const app = express();
const User = require("./models/user")

app.use(express.json());
/*
// app.post("/signup", async (req, res) =>{
//   //creating a new instance
//   const user = new User({
//     firstName: "sachin",
//     lastName: "tandulkar",
//     email: "sachhin@kiyoma.com",
//     password:"sachin@123"
//    // i want this data to be send inside the api while i am making post call
//    //is data ko api ke through sed krna hai aur server pr lana hai 
//   });
*/



app.post("/signup", async (req, res) =>{
  //creating a new instance
  //remember use captail U
 const user = new User(req.body);


  try{
  await user.save();
  res.send("user added successfully");
  }catch(err){
   res.status(400).send("Error saving the user");
  }
});


//try to find out by the one element
//get user email
app.get("/user", async (req, res) =>{

  const userEmail = req.body.email;
 
  try{
    
  const users =await User.find({email:userEmail});
  if(users.length===0){
    res.status(404).send("user nott found")
  }else{res.send(users)}
  
  }catch(err){
   res.status(400).send("Error saving the user");
  }
});

//get by firsname
app.get("/userr", async (req, res) => {
  const firstName = req.body.firstName; // use query param

  try {
    const users = await User.find({ firstName: firstName });

    if (users.length === 0) {
      return res.status(404).send("User not found");
    }

    res.send(users);
  } catch (err) {
    console.error(err);
    res.status(400).send("Error fetching the user");
  }
});

//get all the feed 
app.get ("/feed",async(req,res)=>{
  try{
const users= await User.find({})
res.send(users)
  }catch{
res.status(404).send("somthing went wrong");
  }
})


// delet a user by id 
app.delete("/user",async(req,res)=>{
  const userId = req.body.userId;
  try{
    const user= await User.findByIdAndDelete(userId)
    res.send("deleted success")
  }catch{
res.status(404).send("somthing went wrong");
  }
})

//update the data useingg patch 
app.patch("/user",async(req,res)=>{
  const user = req.body.userId;
  const data = req.body;
  console.log(data);
  try{
  await User.findByIdAndUpdate({_id:user},data,{
    returnDocument:"after",
    //this will run the vaildation whenever this update method will bbe called 
    //remember you have to enable it  runValidators:true like this otherwise it will not update the existing validation  
    runValidators:true
  })
   res.send("update success")
  }catch(err){
   res.status(400).send("Update failed: " + err.message);
  }
})


connectDB()

  .then(()=>{
    console.log("database is established")
    app.listen(3000,()=>{
  console.log("here is the serve");
});
  }).catch(()=>{
    console.error("database is not established")
  })





