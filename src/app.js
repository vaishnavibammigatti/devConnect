const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const bcrypt = require("bcrypt");
const { validateSignUpData } = require("./utils/validation");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { userAuth } = require("./middlewares/auth");

app.use(express.json()); //Converts JSON to Javascript object

app.use(cookieParser()); //Middleware to read cookie

app.post("/signup", async (req, res) => {
  try {
    //Validation of data
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;

    //Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);

    //Creating new instance of User model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    await user.save();
    res.status(201).send("User Created successfully", user);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Email");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      //Create a JWT token

      const token = jwt.sign({ _id: user._id }, "devConnect123");

      //Add the token to cookie and send thh response back to the user
      res.cookie("token", token);

      res.send("Login successful!!");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    //return the user info
    res.send(req.user);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
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
