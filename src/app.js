const express = require("express");
const app = express();

app.use("/test", (req, res) => {
  res.send("Hello from the server");
});

app.use("/hello", (req, res) => {
  res.send("Hello ha hi")
});

app.listen(7898, () => {
  console.log("Server is successfully listening to port 7898");
});
