//const { default: mongoose } = require("mongoose")
import mongoose from "mongoose";
import Validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = "DEV@Tinder$790";


const userSchema = new mongoose.Schema({
  firstName:{
    type: String,
    required:true
  },
  lastName:{
    type: String
  },
  email:{
    type: String,
    lowercase:true,
    required:true,
    unique:true,
    trim:true,
    validate(value){
if(!Validator.isEmail(value)){
  throw new Error("invalidate email"+value)
}
    }
  },
  password:{
    type: String,
    required:true
  },
  age:{
    type: Number,
    min:10
  },
  gender:{
    type: String,
    validate(value){
      if(!["male","female","other"].includes(value)){
        throw new Error("gender is not validate")
      }
    },
  },
  about:{
    type:String,
    default:"this is a default about the user"
  },
  photoUrl:{
    type:String,
    default:"https://www.mjunction.in/blog/pet-coke-effect-on-aluminium-cement-industry/dummy-2/",
      validate(value){
if(!Validator.isURL(value)){
  throw new Error("invalidate email"+value)
}
    }
  },
  skills:{
    type:[String]
  },

},
{
  timestamps:true,
}
);

//dont use the arrow function
// userSchema.method.getJWT= async function {
userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign(
    {_id:user._id},
    JWT_SECRET,
    {expiresIn:"7d"}
  );
  return token;  
};

//userSchema.method.validatePassword = async function(passswordInputByUser) {
  userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password

  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,  //dont interchange this order if you do you can face error
    passwordHash
  );
  return isPasswordValid
}

const User = mongoose.model("User", userSchema);
export default User;