const multer = require("multer");
const Study = require("../models/StudySchema");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const util = require('util');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  folder: "mrcs",
  allowedFormats: null,
  transformation: [{ width: 500, height: 500, crop: "limit" }],
});

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const uploadMiddleware = multer({
  storage: storage,
}).single("image");

const cloudinaryUpload = util.promisify(cloudinary.uploader.upload);

const addStudy = async (req, res) => {
  try {
    const { study_name, study_title, text1, text2, text3, study_description, link, status } = req.body;

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

    if (req.file) {
      try {
        const result = await cloudinaryUpload(req.file.path);
        newStudy.image = result.secure_url;
        newStudy.publicid = result.public_id;
      } catch (error) {
        console.error("Image upload failed:", error);
        return res.status(500).json({ success: false, error: "Image upload failed" });
      }
    }

    await newStudy.save();
    res.status(201).json({ success: true, data: newStudy });
  } catch (error) {
    console.error("Error adding study:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const updateStudy = async (req, res) => {
  try {
    const { study_name, study_title, text1, text2, text3, study_description, link, status } = req.body;
    const { id } = req.params;

    const study = await Study.findById(id);

    if (!study) {
      return res.status(404).json({ success: false, error: "Study not found" });
    }

    for (const prop of ['study_name', 'study_title', 'text1', 'text2', 'text3', 'study_description', 'link', 'status']) {
      study[prop] = req.body[prop];
    }

    if (req.file) {
      try {
        const result = await cloudinaryUpload(req.file.path);
        study.image = result.secure_url;
        study.publicid = result.public_id;
      } catch (error) {
        console.error("Image upload failed:", error);
        return res.status(500).json({ success: false, error: "Image upload failed" });
      }
    }

    await study.save();
    res.json({ success: true, data: study });
  } catch (error) {
    console.error("Error updating study:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const getAllStudyData = async (req, res) => {
  try {
    const studyData = await Study.find().sort({ updatedAt: -1 }).exec();
    res.status(200).json(studyData);
  } catch (error) {
    console.error("Error retrieving study data:", error);
    res.status(500).json({ error: "An error occurred while retrieving study data" });
  }
};

const getStudybyId = async (req, res) => {
  const { id } = req.params;

  try {
    const studyData = await Study.findById(id);
    if (studyData) {
      res.status(200).json(studyData);
    } else {
      res.status(404).json({ error: "Study data not found" });
    }
  } catch (error) {
    console.error("Error retrieving study data by ID:", error);
    res.status(500).json({ error: "An error occurred while retrieving study data" });
  }
};

const deleteStudy = async (req, res) => {
  const id = req.params.id;

  try {
    const studydata = await Study.findByIdAndDelete(id);

    if (!studydata) {
      return res.status(404).json({ error: "Study data not found" });
    }

    if (studydata?.publicid) {
      await cloudinary.uploader.destroy(studydata.publicid);
    }

    res.status(200).json({ message: "Data deleted successfully" });
  } catch (error) {
    console.error("Error deleting study data:", error);
    res.status(500).json({ error: "Failed to delete study data from server" });
  }
};

module.exports = {
  addStudy,
  updateStudy,
  getStudybyId,
  getAllStudyData,
  deleteStudy,
  uploadMiddleware,
};
