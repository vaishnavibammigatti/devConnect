const express = require("express");
const requestRouter = express.Router();

const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");
const { userAuth } = require("../middlewares/auth");

requestRouter.post(
  "/request/send/:status/:userId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.userId;
      const status = req.params.status;

      const allowedStatus = ["ignore", "interested"];
      const isStatusAllowed = allowedStatus.includes(status);

      if (!isStatusAllowed) {
        throw new Error(`${status} is not valid status`);
      }

      //check if duplicate request is being made
      const existingConnection = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnection) {
        throw new Error("Connection request already exists!!");
      }

      //Check if toUserId is valid user
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        throw new Error("User not found!");
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionRequest.save();
      res.status(201).json({
        message: "Connection request sent successfully",
        data,
      });
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  },
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      const allowedStatus = ["accepted", "rejected"];
      const isStatusAllowed = allowedStatus.includes(status);
      if (!isStatusAllowed) {
        throw new Error("Status not allowed!");
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        return res.status(404).send("Connection request does not exist");
      }

      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.status(200).json({
        message: `Connection request ${status} successfully!`,
        data,
      });
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  },
);

module.exports = requestRouter;
