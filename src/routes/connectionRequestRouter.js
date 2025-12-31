const express = require("express");
const router = express.Router();
const { userAuthenticated } = require("../middlewares/auth");

const ConnectionRequest = require("../models/connectionRequest");
const validateUserInput = require("../middlewares/validateUserInput");

router.use("/request", userAuthenticated);

// send connection request
router.post("/request/send/:status/:toUserId", async (req, res) => {
  try {
    const toUserId = req.params.toUserId;
    const fromUserId = req.user._id;
    const status = req.params.status;

    const AllowedStatuses = ["interested", "ignored"];
    if (!AllowedStatuses.includes(status)) {
      return res
        .status(400)
        .json({ message: "Invalid status value: " + status });
    }
    const existingRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });

    if (existingRequest) {
      return res
        .status(400)
        .json({ message: "Connection request already exists" });
    }

    const newRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });
    await newRequest.save();
    res.status(201).json({ message: "Connection request sent successfully" });
  } catch (error) {
    res.status(400).send("Error:" + error.message);
  }
});

router.post("/request/review/:status/:requestId", async (req, res) => {
  try {
    const requestId = req.params.requestId;
    const status = req.params.status;

    const AllowedStatuses = ["accepted", "rejected"];
    if (!AllowedStatuses.includes(status)) {
      return res
        .status(400)
        .json({ message: "Invalid status value: " + status });
    }

    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: req.user._id,
      status: "interested",
    });
    if (!connectionRequest) {
      return res.status(404).json({ message: "Connection request not found" });
    }

    connectionRequest.status = status;
    await connectionRequest.save();
    res
      .status(200)
      .json({ message: "Connection request " + status + " successfully" });
  } catch (error) {
    res.status(400).send("Error:" + error.message);
  }
});

module.exports = router;
