//external Import
const bcrypt = require("bcrypt");
const User = require("../models/People");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const upload = require("../middleware/uploadMiddleware");

// get All User Api  Controller
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    return res.status(500).json({
      // message:"Unknown error occured !",
      // success:false,
      errors: {
        common: {
          msg: `Unknown error occured ! ${err}`,
        },
      },
    });
  }
};

//get Single User Api Controller
const getSingleUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (err) {
    return res.status(500).json({
      errors: {
        common: {
          msg: `Unknown error occured ! ${err}`,
        },
      },
    });
  }
};

// Add User Api Controller
async function addUser(req, res, next) {
  // save user or send error
  try {
    let newUser;
    const hashPassword = await bcrypt.hash(req.body.password, 6);
    newUser = new User({
      ...req.body,
      password: hashPassword,
      joindate: new Date(),
    });

    if (req.file) {
      cloudinary.uploader.upload(req.file.path, async (err, result) => {
        if (err) {
          console.log(err);
          throw new Error("Image upload failed");
        }
      });
      newUser.profile = result.secure_url;
      newUser.publicid = result.public_id;

      await newUser.save();
      return res.status(200).json({
        success: true,
        message: "User added Successfully ! ",
        // data: newUser,
        // success:true,
      });
    } else {
      await newUser.save();
      return res.status(200).json({
        success: true,
        message: "User added Successfully ! ",
        // data: newUser,
        // success:true,
      });
    }
  } catch (err) {
    return res.status(500).json({
      // message:"Unknown error occured !",
      // success:false,
      errors: {
        common: {
          msg: err,
        },
      },
    });
    // console.log(err);
  }
}

async function updateUser(req, res, next) {
  try {
    console.log("req params : ", req.params.id);
    const { id } = req.params;

    // Find the user by ID
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update the user's properties
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.mobile = req.body.mobile || user.mobile;
    user.role = req.body.role || user.role;
    user.usertype = req.body.usertype || user.usertype;

    // Check if the password is being updated
    if (req.body.password) {
      const hashPassword = await bcrypt.hash(req.body.password, 6);
      user.password = hashPassword;
    }

    // Check if there's a new profile image
    if (req.file) {
      // Delete the previous profile image from Cloudinary
      if (user.publicid) {
        await cloudinary.uploader.destroy(user.publicid);
      }

      // Upload the new profile image to Cloudinary
      cloudinary.uploader.upload(req.file.path, async (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            success: false,
            message: "Image upload failed",
          });
        }

        user.profile = result.secure_url;
        user.publicid = result.public_id;

        // Save the updated user
        await user.save();

        return res.status(200).json({
          success: true,
          message: "User updated successfully!",
          // data: user,
        });
      });
    } else {
      // Save the updated user without profile image
      await user.save();

      return res.status(200).json({
        success: true,
        message: "User updated successfully!",
        // data: user,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Unknown error occurred!",
      errors: {
        common: {
          msg: "Unknown error occurred!",
        },
      },
    });
  }
}


// Delete User Api Controller
const deleteUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = await User.findByIdAndDelete(id);
    res.send(`Document with ${data.name} has been deleted... `);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  getUsers,
  getSingleUser,
  addUser,
  updateUser,
  deleteUser,
};
