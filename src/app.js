const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.use(express.json()); //Converts JSON to Javascript object

app.post("/signup", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.status(201).send("User Created successfully", user);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

//get user by emailId
app.get("/getUserByEmailId", async (req, res) => {
  try {
    const user = await User.find({ emailId: req.body.emailId });
    if (user.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.status(200).send(user);
    }
  } catch (err) {
    res.status(400).send("Something went wrong!");
  }
});

//get all users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (err) {
    res.status(400).send("Error occured ", err.message);
  }
});

app.patch("/patchUser", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndUpdate(userId, req.body, {
      returnDocument: "after",
      runValidators: true,
    });
    res.status(200).send("Updated successfully " + user);
  } catch (err) {
    res.status(400).send("Update failed " + err.message);
  }
});

app.delete("/deleteUser", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.body.userId);
    res.status(204).send("Deleted sucessully" + user);
  } catch (err) {
    res.status(400).send("something went wrong");
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
