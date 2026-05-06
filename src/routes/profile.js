const express = require("express");
const profileRouter = express.Router();
const validator = require("validator");
const {
  validateSignUpData,
  validateProfileEditData,
} = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    //return the user info
    res.send(req.user);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    //Validate patch data
    if (!validateProfileEditData(req)) {
      throw new Error("Invalid edit request");
    }
    const loggedInUser = req.user;
    //Update data - loggedInUser[key] = req.body[key]
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    //Save
    res.send(`${loggedInUser.firstName}, your profile updated successfully!`);
    await loggedInUser.save();
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

profileRouter.patch("/profile/password", async (req, res) => {
  try {
    const { emailId, newPassword } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("User does not exist");
    } else {
      const isSamePassword = await user.validatePassword(newPassword);
      if (isSamePassword) {
        throw new Error(
          "Cannot update same password. Try to add new strong password!!",
        );
      }

      if (!validator.isStrongPassword(newPassword)) {
        throw new Error("Enter a strong password");
      }

      //Encrypt the password
      const passwordHash = await bcrypt.hash(newPassword, 10);

      user.password = passwordHash;

      await user.save();
      res.status(200).send("Password updated successfully!");
    }
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = profileRouter;
