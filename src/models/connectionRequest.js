const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      required: true,
      values: ["ignore", "interested", "accepted", "rejected"],
      message: `{VALUE} is incorrect status type`,
    },
  },
  {
    timestamps: true,
  },
);

//Creating compound index
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

connectionRequestSchema.pre("save", function () {
  const connectioRequest = this;
  if (connectioRequest.fromUserId.equals(connectioRequest.toUserId)) {
    throw new Error("Cannot send connection request to yourself!");
  }
  //next();
});
module.exports = mongoose.model("ConnectionRequest", connectionRequestSchema);
