const multer = require("multer");
// const ImageModel = require("../models/imageSchema");
const Question = require("../models/QuestionSchema");
const Result = require("../models/ResultSchema");

const cloudinary = require("cloudinary").v2;
require("dotenv").config();
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const upload = require("../middleware/uploadMiddleware");

const addQuestion = async (req, res) => {
  try {
    // Extract the form data
    const { quizname, question_name, options, qus_description, answer } =
      req.body;

    // Create a new question instance
    const newQuestion = new Question({
      quizname,
      question_name,
      options,
      qus_description,
      answer,
    });

    // Check if an image was uploaded

    // Check if an image was uploaded
    if (req.file) {
      // Upload the image to Cloudinary
      cloudinary.uploader.upload(req.file.path, async (err, result) => {
        if (err) {
          // Handle the error
          console.log(err);
          throw new Error("Image upload failed");
        }

        // Save the image URL and public ID in the question object
        newQuestion.image = result.secure_url;
        newQuestion.publicid = result.public_id;

        // Save the question to the database
        await newQuestion.save();

        res.status(201).json({ success: true, data: newQuestion });
      });
    } else {
      // If no image was uploaded, save the question directly to the database
      await newQuestion.save();
      res.status(201).json({ success: true, data: newQuestion });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const updateQuestion = async (req, res) => {
  try {
    // Extract the form data
    const { quizname, question_name, options, qus_description, answer } =
      req.body;
    const { id } = req.params;

    // Find the question by ID
    const question = await Question.findById(id);

    if (!question) {
      return res
        .status(404)
        .json({ success: false, error: "Question not found" });
    }

    // Update the question fields
    question.quizname = quizname;
    question.question_name = question_name;
    question.options = options;
    question.qus_description = qus_description;
    question.answer = answer;

    // Check if an image was uploaded
    if (req.file) {
      // Upload the image to Cloudinary
      cloudinary.uploader.upload(req.file.path, async (err, result) => {
        if (err) {
          // Handle the error
          console.log(err);
          throw new Error("Image upload failed");
        }

        // Save the image URL and public ID in the question object
        question.image = result.secure_url;
        question.publicid = result.public_id;

        // Save the updated question
        await question.save();

        res.json({ success: true, data: question });
      });
    } else {
      // If no image was uploaded, save the updated question directly
      await question.save();
      res.json({ success: true, data: question });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getAllQuestionData = async (req, res) => {
  try {
    const questionData = await Question.find().sort({ updatedAt: -1 }).exec();
    res.status(200).json(questionData);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "An error occurred while retrieving Question Data",
    });
  }
};

const getAllQuestion_BY_Quiz = async (req, res, next) => {
  const quizName = req.query.quiz; // retrieve category name from query parameter
  try {
    if (!quizName) {
      return res.status(400).json({
        errors: {
          common: {
            msg: `Quiz name is required in the query parameter!`,
          },
        },
      });
    }
    const questionAll = await Question.find({ quizname: quizName }, "-answer")
      .sort({ updatedAt: -1 })

      .exec(); // retrieve quiz by category name
    if (!questionAll || questionAll.length === 0) {
      return res.status(404).json({
        errors: {
          common: {
            msg: `No Question found for this Quiz ${quizName}!`,
          },
        },
      });
    }
    res.json(questionAll);
  } catch (err) {
    return res.status(500).json({
      errors: {
        common: {
          msg: `Unknown error occurred! ${err}`,
        },
      },
    });
  }
};

// Handle GET request to retrieve a single Question Data by ID
const getQuestionbyId = async (req, res) => {
  const { id } = req.params;

  try {
    const questionData = await Question.findById(id);
    if (questionData) {
      res.status(200).json(questionData);
    } else {
      res.status(404).json({
        error: "Question Data  not found",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "An error occurred while retrieving the Question Data",
    });
  }
};

const deleteQuestion = (req, res) => {
  const questionId = req.params.id;

  Question.findByIdAndDelete(questionId, function (err, questiondata) {
    if (err) {
      console.log(err);
      return res
        .status(500)
        .json({ error: "Failed to delete Question Data from database" });
    }
    if (!questiondata) {
      return res.status(404).json({ error: "Question Data not found" });
    }
    // Delete image from Cloudinary
    cloudinary.uploader.destroy(questiondata.publicid, function (err, result) {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .json({ error: "Failed to delete image from Cloudinary" });
      }
      console.log(result);
      res.status(200).json({ message: "Question data deleted successfully!" });
    });
  });
};

// Calculate the score based on the matching of selected_value with question.answer
const calculateScore = (question, selectedValue) => {
  let score = 0;
  if (selectedValue === question.answer) {
    score = 1;
    question.answeredCorrectly = true; // Add a flag to track correct answers
  } else if (question.answeredCorrectly) {
    score = question.score + 1; // Increment score if the previous answer was correct
  }
  return score;
};

const addResult = async (req, res) => {
  try {
    const { userId, items, username,quizName } = req.body;

    let totalScore = 0;
    const results = [];

    for (const item of items) {
      const question = await Question.findById(item.question_id);
      if (!question) {
        console.log(`Question with ID ${item.question_id} not found`);
        continue;
      }

      const score = calculateScore(question, item.selected_value);
      totalScore += score;

      const resultItem = {
        question: question._id,
        selected_value: item.selected_value,
        score: score,
        questionData: question.toObject(), // Include the full question data
      };

      results.push(resultItem);
    }

    const response = new Result({
      userId: userId,
      userName: username,
      results: results,
      totalScore: totalScore,
      quizName: quizName,
    });

    const resultdata = await response.save();

    res.status(200).json({ message: "Items submitted successfully", resultdata, totalScore });
  } catch (error) {
    console.error("Error submitting items:", error);
    res.status(500).json({ message: "Failed to submit items" });
  }
};




const getAllResult = async (req, res) => {
  try {
    const resultData = await Result.find().sort({ updatedAt: -1 }).exec();
    res.status(200).json(resultData);
  } catch (error) {
    console.error("Error retrieving result data:", error);
    res.status(500).json({ error: "An error occurred while retrieving result data" });
  }
};

const getAllResult_BY_User = async (req, res, next) => {
  try {
    const userId = req.params.userId; // Extract the userId from the request parameters

    const results = await Result.find({ userId: userId }); // Find results matching the userId

    res.status(200).json({ results });
  } catch (error) {
    console.error("Error retrieving results by userId:", error);
    res.status(500).json({ message: "Failed to retrieve results" });
  }
};
const getResultbyId = async (req, res) => {
  const { id } = req.params;

  try {
    const resultData = await Result.findById(id);
    if (resultData) {
      res.status(200).json(resultData);
    } else {
      res.status(404).json({
        error: "Result Data  not found",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "An error occurred while retrieving the Question Data",
    });
  }
};

module.exports = {
  addQuestion,
  updateQuestion,
  getQuestionbyId,
  getAllQuestionData,
  deleteQuestion,
  getAllQuestion_BY_Quiz,
  addResult,
  getResultbyId,
  getAllResult_BY_User,
  getAllResult

};
