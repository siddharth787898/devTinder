//const  mongoose  = require("mongoose");

// const mongoose =  require("mongoose")


// const connectDB = async()=>{
//   await mongoose.connect(
//     "mongodb+srv://siddharthkasera986:X1zqueDRavIQNrx@cluster0.p4o2a2t.mongodb.net/devTinder");
// };


const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect( 
      // "mongodb+srv://siddharthkasera986:X1zqueDRavIQNrx@cluster0.p4o2a2t.mongodb.net/devtinder?retryWrites=true&w=majority&appName=Cluster0"
      
       
   "mongodb+srv://siddharthkasera986:X1zqueDRavIQNrx@cluster0.p4o2a2t.mongodb.net/devtinder?retryWrites=true&w=majority"
    );
  } catch (err) {
    console.error("Error Connection");
    throw err;
  }
};
module.exports=connectDB;



