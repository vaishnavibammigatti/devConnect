const mongoose = require("mongoose");
const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://vaishnavibammigatti:mongodbpwd@firstcluster.1svrs9p.mongodb.net/devConnect",
  );
};

module.exports = connectDB;

