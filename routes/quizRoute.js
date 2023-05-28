// external imports
const express = require("express");

const router = express.Router();

const {
  getQuiz,
  addQuiz,
  updateQuiz,
  deleteQuiz,
  getSingleQuiz,
  getCategory_NameWise_AllQuiz,
} = require("../controller/quizController");
const {
  quizValidator,
  quizValidationHandler,
} = require("../middleware/quiz/quizValidation");
const upload = require("../middleware/uploadMiddleware");
// get Image
router.get("/", getQuiz);

//get All quiz by Category Wise
router.get("/quizbycategory", getCategory_NameWise_AllQuiz);

// get by Single Image
router.get("/:id", getSingleQuiz);

// post Image
router.post("/add", 
    upload,
    quizValidator,
    quizValidationHandler,
    addQuiz
  );

// delete Image
router.delete("/delete/:id", deleteQuiz);

// update Image
router.put("/update/:id", upload,updateQuiz);

module.exports = router;
