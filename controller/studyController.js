const multer = require("multer");
// const ImageModel = require("../models/imageSchema");
const Study = require("../models/StudySchema");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const upload = require("../middleware/uploadMiddleware");

const addStudy = async (req, res) => {
  try {
    // Extract the form data
    const { study_name, study_title, text1,text2,text3,study_description,link,status } =
      req.body;

    // Create a new question instance
    const newStudy = new Study({
      study_name,
      study_title,
      text1,
      text2,
      text3,
      link,
      study_description,
      status
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
        newStudy.image = result.secure_url;
        newStudy.publicid = result.public_id;

        // Save the question to the database
        await newStudy.save();

        res.status(200).json({ success: true, data: newStudy });
      });
    } else {
      // If no image was uploaded, save the Study directly to the database
      await newStudy.save();
      res.status(201).json({ success: true, data: newStudy });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const updateStudy = async (req, res) => {
  try {
    // Extract the form data
    const { study_name, study_title, text1,text2,text3,study_description,link,status } =
    req.body;
    const { id } = req.params;

    // Find the question by ID
    const study = await Study.findById(id);

    if (!study) {
      return res
        .status(404)
        .json({ success: false, error: "study not found" });
    }

    // Update the study fields
    study.study_name = study_name;
    study.study_title = study_title;
    study.text1 = text1;
    study.text2 = text2;
    study.text3 = text3;
    study.study_description = study_description;
    study.link = link;
    study.status = status;

    // Check if an image was uploaded
    if (req.file) {
      // Upload the image to Cloudinary
      cloudinary.uploader.upload(req.file.path, async (err, result) => {
        if (err) {
          // Handle the error
          console.log(err);
          throw new Error("Image upload failed");
        }

        // Save the image URL and public ID in the study object
        study.image = result.secure_url;
        study.publicid = result.public_id;

        // Save the updated study
        await study.save();

        res.json({ success: true, data: study });
      });
    } else {
      // If no image was uploaded, save the updated study directly
      await study.save();
      res.json({ success: true, data: study });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getAllStudyData = async (req, res) => {
  try {
    const studyData = await Study.find().sort({ updatedAt: -1 }).exec();
    res.status(200).json(studyData);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "An error occurred while retrieving Study Data",
    });
  }
};

// Handle GET request to retrieve a single Question Data by ID
const getStudybyId = async (req, res) => {
  const { id } = req.params;

  try {
    const studyData = await Study.findById(id);
    if (studyData) {
      res.status(200).json(studyData);
    } else {
      res.status(404).json({
        error: "Study Data  not found",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "An error occurred while retrieving the Study Data",
    });
  }
};

const deleteStudy = (req, res) => {
  const studyId = req.params.id;

  Study.findByIdAndDelete(studyId, function (err, studydata) {
    if (err) {
      console.log(err);
      return res
        .status(500)
        .json({ error: "Failed to delete Study Data from database" });
    }
    if (!studydata) {
      return res.status(404).json({ error: "Study Data not found" });
    }
    // Delete image from Cloudinary
    cloudinary.uploader.destroy(studydata.publicid, function (err, result) {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .json({ error: "Failed to delete image from Cloudinary" });
      }
      console.log(result);
      res.status(200).json({ message: "Study data deleted successfully!" });
    });
  });
};

module.exports = {
  addStudy,
  updateStudy,
  getStudybyId,
  getAllStudyData,
  deleteStudy,
  
};
