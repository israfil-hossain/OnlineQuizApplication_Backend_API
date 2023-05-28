const mongoose = require("mongoose");
const Question = require('./QuestionSchema');

const ResultSchema = new mongoose.Schema({
  results: [
    {
      question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },
      selected_value : String, 
      score: {
        type: Number,
        default: 0,
      },
      questionData: {
        type: mongoose.Schema.Types.Mixed, // Mixed type to store the entire question object
      },
    },
  ],
  totalScore: {
    type: Number,
    default: 0,
  },
  userId:{
    type: String,
  },
  userName:{
    type:String,
  },
  quizName:{
    type:String,
  }
});

const Result = mongoose.model("result", ResultSchema);
module.exports = Result;
