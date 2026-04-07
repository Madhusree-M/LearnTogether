// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    user_id: {
      type: Number,
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["student", "teacher", "admin"],
      default: "student"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
