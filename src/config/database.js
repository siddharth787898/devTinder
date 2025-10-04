import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://siddharthkasera986:X1zqueDRavIQNrx@cluster0.p4o2a2t.mongodb.net/devtinder?retryWrites=true&w=majority"
    );
    console.log("✅ MongoDB connected successfully!");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    throw err;
  }
};

export default connectDB;