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
    throw new Error("Please enter a strong password");
  }
};

module.exports = { validateSignupData };
