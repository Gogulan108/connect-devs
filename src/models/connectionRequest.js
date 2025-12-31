const mongoose = require("mongoose");

const ConnectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["interested", "accepted", "rejected", "ignored"],
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);
ConnectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

const ConnectionRequest = new mongoose.model(
  "ConnectionRequest",
  ConnectionRequestSchema
);

ConnectionRequestSchema.pre("save", function (next) {
  //fromUserId and toUserId should not be the same
  if (this.fromUserId.equals(this.toUserId)) {
    throw new Error("fromUserId and toUserId cannot be the same");
  }
  next();
});
module.exports = ConnectionRequest;
