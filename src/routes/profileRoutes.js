const express = require("express");
const router = express.Router();
const { userAuthenticated } = require("../middlewares/auth");
const validateUserInput = require("../middlewares/validateUserInput");

const User = require("../models/userModel");

// Home route
router.use("/profile", userAuthenticated);

// Get user profile
router.get("/profile/view", (req, res) => {
  try {
    if (req.user) {
      res.status(200).send(req.user);
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    console.error("Error during user retrieval:", error);
    res.status(400).send("Something went wrong");
  }
});

// Update profile by id
router.patch("/profile/edit", validateUserInput, async (req, res) => {
  try {
    const userId = req.user._id; //logged in user id
    const updateData = req.body.updatedData;
    const EditableFields = [
      "firstName",
      "lastName",
      "phoneNumber",
      "age",
      "description",
      "skills",
      "profileImage",
    ];

    const isContainsOnlyEditableFields = Object.keys(updateData).every(
      (field) => EditableFields.includes(field)
    );

    if (!isContainsOnlyEditableFields) {
      return res
        .status(400)
        .json({ message: "Attempt to update non-editable fields" });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      returnDocument: "after",
    });
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    res.status(400).send("Error:" + error.message);
  }
});

// Delete profile user by id
router.delete("/profile/delete", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.status(200).send("User deleted successfully");
  } catch (error) {
    res.status(400).send("Error:" + error.message);
  }
});
module.exports = router;
