const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: [true, "Please provide category name"],
    },
    image: {
      type: String,
    },
    publicid: {
      type: String,
    },
    accessibility: {
      type: String,
      default: "unpaid",
      enum: ["paid", "unpaid"],
    },
    quiz_status: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    quiz_name: {
      type: String,
      required: [true, "Please provide Quiz name"],
    },
    quiz_description: {
      type: String,
      required: [true, "Please provide Quiz Description"],
    },
  },
  { timestamps: true }
);

const Quiz = mongoose.model("quiz", quizSchema);
module.exports = Quiz;
