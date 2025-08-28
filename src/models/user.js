//const { default: mongoose } = require("mongoose")

const mongoose =require("mongoose")

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
    trim:true
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
    default:"https://www.mjunction.in/blog/pet-coke-effect-on-aluminium-cement-industry/dummy-2/"
  },
  skills:{
    type:[String]
  },

},
{
  timestamps:true,
}
);
const User = mongoose.model("User", userSchema);

module.exports = User;