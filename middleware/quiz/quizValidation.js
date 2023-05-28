// external imports 
const {check, validationResult } = require("express-validator"); 
const createError = require("http-errors"); 
const Quiz = require("../../models/QuizSchema"); 

const quizValidator=[
    check("category")
    .isLength({
        min:2
    })
    .withMessage("Category name is required !"),

    check("quiz_name")
    .isLength({
        min:2
    })
    .withMessage("Quiz name is required !")
    .custom(async(value)=>{
        try{
            const quiz = await Quiz.findOne({quiz_name:value}); 
            if(quiz){
                throw createError(409,"Quiz Name already in used!"); 
            }
        }
        catch(err){
            throw createError(500,err.message); 
        }
    }), 

    check("quiz_status")
    .isLength({
        min:3
    })
    .withMessage("Quiz Status is required !"), 
]; 

const quizValidationHandler = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      next();
    } else {
      res.status(500).json({
        errors: errors.mapped(),
      });
    }
  };

module.exports = {
    quizValidator, 
    quizValidationHandler
}