// const validator = require("validator");

// const validateSignupData = (req) => {
//   const { firstName, lastName, email, password } = req.body;

//   if (!firstName || !lastName) {
//     throw new Error("Name is not valid");
//   } else if (!validator.isEmail(email)) {
//     throw new Error("Email is not valid");
//   } else if (!validator.isStrongPassword(password)) {
//     throw new Error("Please enter a strong password");
//   }
// };

// module.exports = { validateSignupData };

const JWT_SECRET = "DEV@Tinder$790";
const validator = require("validator");

const validateSignupData = (body) => {   // 👈 expect body directly
  const { firstName, lastName, email, password } = body;

  if (!firstName || !lastName) {
    throw new Error("Name is not valid");
  } else if (!validator.isEmail(email)) {
    throw new Error("Email is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a stronger password");
  }

  return true; // ✅ success case
}

const validateEditProfileData = (req)=>{
  const allowedEditFeilds = [
    "firstName",
    "lastName",
    "email",
    "age",
    "gender",
    "skills",
    "about",
    "photoUrl"
  ];
  //i will just loop through this req.body and check if all this thing are matching this critarea or not
  //i will check that every field is present inside my allowedFields inculdes that field
  const isEditAllowed = Object.keys(req.body).every((Field)=>
  allowedEditFeilds.includes(Field)
  );
  return isEditAllowed;
}

module.exports = { validateSignupData,
                   validateEditProfileData 
                  };
