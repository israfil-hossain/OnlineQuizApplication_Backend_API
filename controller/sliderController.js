const path = require("path");
const multer = require("multer");
const Slider = require("../models/SliderSchema");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Set up storage engine for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  folder: "mrcs",
  // allowedFormats: ['jpg', 'jpeg', 'png'],
  allowedFormats: null,
  transformation: [{ width: 500, height: 400, crop: "limit" }],
});

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Initialize multer middleware
// Set up Multer upload middleware
const upload = multer({
  storage: storage,
}).single("image");

// Handle POST request to upload image and store image URL in database
const addSlider = async (req, res) => {
  try {
    upload(req, res, async function (err) {
      if (err) {
        console.log(err);
        return res.status(400).json({ error: err.message });
      }
      console.log(req.file);
      const newSlider = new Slider({
        text: req.body.text,
        status: req.body.status,
        link: req.body.link,
      });

      // Upload image to Cloudinary
      if (req.file) {
        cloudinary.uploader.upload(req.file.path, async function (err, result) {
          if (err) {
            console.log(err);
            return res
              .status(500)
              .json({ error: "Failed to upload image to Cloudinary" });
          }
          
          newSlider.imageUrl = result.secure_url; 
          newSlider.public_id = result.public_id;

          // Save image URL and status to MongoDB
          await newSlider.save();

          res.status(200).json({
            message: "Slider uploaded successfully!",
            imageUrl: newSlider.imageUrl,
            status: newSlider.status,
            text: newSlider.text,
            link: newSlider.link,  // Fixed this line
          });
        });
      } else {
        await newSlider.save(); 
        res.status(200).json({
          message: "Slider uploaded successfully!",
          imageUrl: newSlider.imageUrl,
          status: newSlider.status,
          text: newSlider.text,
          link: newSlider.link,  // Fixed this line
        });
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


// Handle PUT request to update a slider image
const updateSlider = (req, res) => {
  upload(req, res, function (err) {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: err.message });
    }

    // Check if an image file was uploaded
    if (req.file) {
      // Upload image to Cloudinary
      cloudinary.uploader.upload(req.file.path, function (err, result) {
        if (err) {
          console.log(err);
          return res
            .status(500)
            .json({ error: "Failed to upload image to Cloudinary" });
        }

        // Find and update slider in MongoDB
        Slider.findByIdAndUpdate(
          req.params.id,
          {
            imageUrl: result.secure_url,
            public_id: result.public_id,
            status: req.body.status,
            link: req.body.link,
            text: req.body.text,
          },
          { new: true },
          function (err, updatedSlider) {
            if (err) {
              console.log(err);
              return res
                .status(500)
                .json({ error: "Failed to update slider in database" });
            }
            res.status(200).json({
              message: "Slider image updated successfully!",
              imageUrl: updatedSlider.imageUrl,
              status: updatedSlider.status,
              link: updatedSlider.link, // Updated here
              text: updatedSlider.text, // Updated here
            });
          }
        );
      });
    } else {
      // No image uploaded, update only non-image fields
      Slider.findByIdAndUpdate(
        req.params.id,
        {
          status: req.body.status,
          link: req.body.link,
          text: req.body.text,
        },
        { new: true },
        function (err, updatedSlider) {
          if (err) {
            console.log(err);
            return res
              .status(500)
              .json({ error: "Failed to update slider in database" });
          }
          res.status(200).json({
            message: "Slider updated successfully!",
            imageUrl: updatedSlider.imageUrl,
            status: updatedSlider.status,
            link: updatedSlider.link,
            text: updatedSlider.text,
          });
        }
      );
    }
  });
};

const getAllSliderImages = async (req, res) => {
  try {
    const sliderImages = await Slider.find();
    res.status(200).json(sliderImages);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "An error occurred while retrieving slider images",
    });
  }
};

// Handle GET request to retrieve a single slider image by ID
const getSliderImageById = async (req, res) => {
  const { id } = req.params;

  try {
    const sliderImage = await Slider.findById(id);
    if (sliderImage) {
      res.status(200).json(sliderImage);
    } else {
      res.status(404).json({
        error: "Slider image not found",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "An error occurred while retrieving the slider image",
    });
  }
};

const deleteSlider = (req, res) => {
  const sliderId = req.params.id;

  Slider.findByIdAndDelete(sliderId, function (err, slider) {
    if (err) {
      console.log(err);
      return res
        .status(500)
        .json({ error: "Failed to delete slider from database" });
    }
    if (!slider) {
      return res.status(404).json({ error: "Slider not found" });
    }
    // Delete image from Cloudinary
    cloudinary.uploader.destroy(slider.public_id, function (err, result) {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .json({ error: "Failed to delete image from Cloudinary" });
      }
      console.log(result);
      res.status(200).json({ message: "Slider deleted successfully!" });
    });
  });
};

module.exports = {
  addSlider,
  updateSlider,
  getSliderImageById,
  getAllSliderImages,
  deleteSlider,
};
