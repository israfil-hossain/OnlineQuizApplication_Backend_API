// User Model
const mongoose = require("mongoose");

const peopleSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    joindate: {
      type: Date,
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin", "superadmin"],
    },

    usertype: {
      type: String,
      default: "unpaid",
      enum: ["paid", "unpaid"],
    },
    mobile: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    resetToken: {
      type: String,
    },
    lastActivity: {
      type: Date,
      default: Date.now,
    },
    profile: {
      type: String,
    },
    publicid: {
      type: String,
    },
    activityLog: [
      {
        action: String,
        timestamp: Date,
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("People", peopleSchema);

module.exports = User;
