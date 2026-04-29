const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.post("/signup", async (req, res) => {
  const user = new User({
    firstName: "Pavitra",
    lastName: "patil",
    emailId: "pavvi@g.com",
    password: "234",
  });

  try {
    await user.save();
    res.status(201).send("User Created successfully", user);
  } catch (err) {
    res.status(400).send("Error occured ", err.message);
  }
});

connectDB()
  .then(() => {
    console.log("Database connection established... ");
    app.listen(7898, () => {
      console.log("Server is successfully listening to port 7898");
    });
  })
  .catch((err) => {
    console.log("Databse cannot be connected!");
  });
