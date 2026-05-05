const validator = require("validator");
const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Name is not valid");
  } else if (firstName.length < 4 || firstName.length > 50) {
    throw new Error("Firstname should be 4 to 50 characters");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Invalid credentials");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Invalid credentials");
  }
};

module.exports = { validateSignUpData };
