import validator from "validator";

const JWT_SECRET = "DEV@Tinder$790";

export const validateSignupData = (body) => {
  const { firstName, lastName, email, password } = body;

  if (!firstName || !lastName) {
    throw new Error("Name is not valid");
  } else if (!validator.isEmail(email)) {
    throw new Error("Email is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a stronger password");
  }

  return true;
};

export const validateEditProfileData = (body) => {
  const allowedEditFeilds = [
    "firstName",
    "lastName",
    "email",
    "age",
    "gender",
    "skills",
    "about",
    "photoUrl",
  ];

  const isEditAllowed = Object.keys(body).every((field) =>
    allowedEditFeilds.includes(field)
  );

  return isEditAllowed;
};