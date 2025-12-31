const express = require("express");
const router = express.Router();
const { userAuthenticated } = require("../middlewares/auth");

const User = require("../models/userModel");
const ConnectionRequest = require("../models/connectionRequest");

// Home route
router.use("/user", userAuthenticated);

// Get user connections
router.get("/user/connections", async (req, res) => {
  try {
    const userId = req.user._id;
    const connections = await ConnectionRequest.find({
      $or: [
        { fromUserId: userId, status: "accepted" },
        { toUserId: userId, status: "accepted" },
      ],
    }).populate(
      "fromUserId toUserId",
      "firstName lastName age profileImage gender skills"
    ); // populate fromUserId and toUserId like ["firstName", "lastName", "age", "profileImage"] || "firstName lastName age profileImage"
    res.status(200).json({ data: connections });
  } catch (error) {
    res.status(400).send("Error:" + error.message);
  }
});
// get connection requests received
router.get("/user/requests/received", async (req, res) => {
  try {
    const userId = req.user._id;
    const requests = await ConnectionRequest.find({
      toUserId: userId,
      status: "interested",
    }).populate(
      "fromUserId",
      "firstName lastName age profileImage gender skills"
    ); // populate fromUserId like ["firstName", "lastName", "age", "profileImage"] || "firstName lastName age profileImage"
    res.status(200).send(requests);
  } catch (error) {
    res.status(400).send("Error:" + error.message);
  }
});

// get connection requests sent
router.get("/user/requests/sent", (req, res) => {
  try {
    const userId = req.user._id;
    const requests = ConnectionRequest.find({
      fromUserId: userId,
      status: "interested",
    }).populate(
      "toUserId",
      "firstName lastName age profileImage gender skills"
    ); // populate toUserId like ["firstName", "lastName", "age", "profileImage"] || "firstName lastName age profileImage"
    res.status(200).send(requests);
  } catch (error) {
    res.status(400).send("Error:" + error.message);
  }
});

// Get all users (feed)
router.get("/feed", userAuthenticated, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: req.user._id }, { toUserId: req.user._id }],
    }).select("fromUserId toUserId");

    const hideConnections = new Set();

    connectionRequests.forEach((request) => {
      hideConnections.add(request.fromUserId.toString());
      hideConnections.add(request.toUserId.toString());
    });

    hideConnections.add(req.user._id.toString()); // Hide self as well

    const feedUsers = await User.find({
      _id: { $nin: Array.from(hideConnections) }, //not in hideConnections set
    })
      .select("firstName lastName age profileImage gender skills")
      .skip(skip)
      .limit(limit);

    res.status(200).json({ data: feedUsers });
  } catch (error) {
    res.status(400).send("Error:" + error.message);
  }
});

module.exports = router;
