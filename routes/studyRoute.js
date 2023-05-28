// external imports
const express = require("express");

const router = express.Router();

const {
  addStudy,
  updateStudy,
  getStudybyId,
  getAllStudyData,
  deleteStudy,
} = require("../controller/studyController");

const upload = require("../middleware/uploadMiddleware");
// const { imageValidator,imageValidationHandler } = require("../middleware/image/imageValidator");

// get All Questions
router.get("/", getAllStudyData);

// get by Single Question
router.get("/:id", getStudybyId);

// post Question
router.post("/add",upload,addStudy);

// delete question
router.delete("/delete/:id", deleteStudy);

// update question
router.put("/update/:id", upload,updateStudy);

module.exports = router;
