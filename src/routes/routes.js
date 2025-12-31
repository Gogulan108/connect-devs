const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");
const userConnectionRoutes = require("./userConnectionRoutes");
const profileRoutes = require("./profileRoutes");
const connectionRequestRouter = require("./connectionRequestRouter");

// Use auth routes for signup and login
router.use("/", authRoutes);

// Use main routes for other endpoints
router.use("/", userConnectionRoutes);

// Use profile routes
router.use("/", profileRoutes);

// Connection request routes
router.use("/", connectionRequestRouter);

module.exports = router;
