// external imports
const express = require("express");

const router = express.Router();

const {
    addQuestion,
    updateQuestion,
    getQuestionbyId,
    getAllQuestionData,
    deleteQuestion,
    getAllQuestion_BY_Quiz,
} = require("../controller/questionController");

const upload = require("../middleware/uploadMiddleware");
// const { imageValidator,imageValidationHandler } = require("../middleware/image/imageValidator");

// get All Questions
router.get("/", getAllQuestionData);

// get All Question By Quiz name wise 
router.get("/questionbyquiz", getAllQuestion_BY_Quiz);


// get by Single Question
router.get("/:id", getQuestionbyId);

// post Question
router.post("/add",upload,addQuestion);

// delete question
router.delete("/delete/:id", deleteQuestion);

// update question
router.put("/update/:id", upload,updateQuestion);

module.exports = router;
