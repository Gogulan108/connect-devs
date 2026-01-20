const jwt = require("jsonwebtoken");

const User = require("../models/userModel");

const userAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(400).send("Please login to access this resource");
    }

    const decodeUser = jwt.verify(
      req.cookies.token,
      process.env.JWT_SECRET_KEY
    );

    const user = await User.findOne({ _id: decodeUser.id });

    if (!user) {
      throw new Error("User not found");
    } else {
      req.user = user;
      next();
    }
  } catch (error) {
    return res.status(401).send(error.message);
  }
};
module.exports = {
  userAuthenticated,
};
