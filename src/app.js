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

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);



app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  res.send(req.user.firstName + " sent the connection request");
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
