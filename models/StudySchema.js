const mongoose = require('mongoose');

const studySchema = new mongoose.Schema({
  study_name:{
    type:String,
    required:[true,"Please provide Study Name"]

  },
  study_title:{
    type:String,
  },
  text1:{
    type:String,
  },
  text2:{
    type:String,
  },
  text3:{
    type:String,
  },
  
  image: {
    type: String,
  },
  publicid:{
    type:String,
  },
  study_description: {
    type: String,
  },
  status: {
    type:String, 
    required: true, 
    trim : true, 
    lowercase : true, 
  },
  link:{
    type:String,
  },
},{ timestamps: true });


const Study = mongoose.model('study',studySchema);
module.exports = Study
