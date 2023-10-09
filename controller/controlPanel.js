const ControlPanel = require("../models/ControlPanelSchema");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
require("dotenv").config();
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Set up storage engine for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  folder: "mrcs",
  // allowedFormats: ['jpg', 'jpeg', 'png'],
  allowedFormats: null,
  transformation: [{ width: 500, height: 500, crop: "limit" }],
});

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
const upload = multer({
  storage: storage,
}).single("image");

const getAllData = async (req, res) => {
  try {
    const controlPanel = await ControlPanel.find()
      .sort({ updatedAt: -1 })
      .exec();
    res.json(controlPanel);
  } catch (err) {
    return res.status(500).json({
      errors: {
        common: {
          msg: `Unknown error occured ! ${err.message}`,
        },
      },
    });
  }
};

const addControlPanel = async (req, res) => {
  try {
    upload(req, res, async function (err) {
      if (err) {
        console.log(err);
        return res.status(400).json({ error: err.message });
      }
      console.log(req.file);
      const newControl = new ControlPanel({
        title: req.body.title,
        status: req.body.status,
        link: req.body.link,
        subtitle: req.body.subtitle,
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
          console.log("===> result", result);
          newControl.image = result.secure_url;
          newControl.publicid = result.public_id;

          // Save image URL and status to MongoDB
          await newControl.save();

          res.status(200).json({
            message: "Add Successfully!",
            data: newControl,
          });
        });
      } else {
        await newControl.save();
        res.status(200).json({
          message: "Add successfully!",
          data: newControl,
        });
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
const updateControlPanel = (req, res) => {
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
        ControlPanel.findByIdAndUpdate(
          req.params.id,
          {
            image: result.secure_url,
            publicid: result.public_id,
            status: req.body.status,
            link: req.body.link,
            title: req.body.title,
            subtitle: req.body.subtitle,
          },
          { new: true },
          function (err, updatedSlider) {
            if (err) {
              console.log(err);
              return res
                .status(500)
                .json({ error: "Failed to update in database" });
            }
            res.status(200).json({
              message: "Updated successfully!",
              image: updatedSlider.image,
              status: updatedSlider.status,
              link: updatedSlider.link, // Updated here
              title: updatedSlider.title, // Updated here
              subtitle: updatedSlider.subtitle, // Updated here
            });
          }
        );
      });
    } else {
      // No image uploaded, update only non-image fields
      ControlPanel.findByIdAndUpdate(
        req.params.id,
        {
          status: req.body.status,
          link: req.body.link,
          text: req.body.text,
          title: req.body.title, // Updated here
          subtitle: req.body.subtitle,
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

const deleteControlPanel = async (req, res, next) => {
  const id = req.params.id;
  ControlPanel.findByIdAndDelete(id, function (err, controldata) {
    if (err) {
      console.log(err);
      return res.status(500).json({
        error: "Failed to delete Control Settings Data from database",
      });
    }
    if (!controldata) {
      return res.status(404).json({ error: "ControlPanel Data not Found" });
    }
    // Delete API
    if (controldata.publicid) {
      cloudinary.uploader.destroy(controldata.publicid, function (err, result) {
        if (err) {
          console.log(err);
          return res
            .status(500)
            .json({ error: "Failded to delete image from Cloudinary" });
        }
        console.log(result);
        res
          .status(200)
          .json({ message: "Data deleted successfully" });
      });
    } else {
      res
        .status(200)
        .json({ message: "Data deleted successfully" });
    }
  });
};

module.exports = {
  getAllData,
  addControlPanel,
  updateControlPanel,
  deleteControlPanel,
};
