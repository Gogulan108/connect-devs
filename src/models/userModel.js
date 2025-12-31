const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      validate(value) {
        const isValidEmail = validator.isEmail(value);
        if (!isValidEmail) {
          throw new Error("Invalid email address: " + value);
        }
      },
    },
    phoneNumber: {
      type: String,
    },
    age: {
      type: Number,
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter a Strong Password: " + value);
        }
      },
    },
    description: {
      type: String,
      default: " this is user description default message please add properly",
    },
    profileImage: {
      type: String,
      default:
        "https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-High-Quality-Image.png",
    },
    skills: {
      type: [String],
      default: [],
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.methods.validatePassword = async function (userPassword) {
  const hashedPassword = this.password;

  const isPasswordValid = await bcrypt.compare(userPassword, hashedPassword);

  return isPasswordValid;
};

userSchema.methods.getJwt = async function () {
  const user = this;
  const jwtToken = await jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "7d",
    }
  );
  return jwtToken;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
