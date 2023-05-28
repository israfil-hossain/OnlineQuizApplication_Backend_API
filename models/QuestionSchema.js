const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  quizname:{
    type:String,
    required:[true,"Please provide Quiz Name"]

  },
  quizid:{
    type:String,
  },
  question_name: {
    type: String,
    required: [true,"Please provide Question"]
  },
  image: {
    type: String,
  },
  publicid:{
    type:String,
  },
  options: {
    type: [
      {
        option_a: {
          type: String,
          default: "",
        },
        option_b: {
          type: String,
          default: "",
        },
        option_c: {
          type: String,
          default: "",
        },
        option_d: {
          type: String,
          default: "",
        },
        option_e: {
          type: String,
          default: "",
        },
       
      }
    ],
    default: [{}], // Set a default empty object in case options are not provided
  },
  answer:{
    type: String, 
    default:"",
  },
  
  qus_description: {
    type: String,
  }
},{ timestamps: true });


const Question = mongoose.model('question',questionSchema);
module.exports = Question
