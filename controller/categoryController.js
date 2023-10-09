const Category = require("../models/CategorySchema");
const cloudinary = require("cloudinary").v2;
const upload = require("../middleware/uploadMiddleware");

// get All Category Api
const getCategory = async (req, res, next) => {
  try {
    const category = await Category.find().sort({ updatedAt: -1 }).exec();
    res.json(category);
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

//get Single Package Api
const getSingleCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    res.json(category);
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

// Add Category Api Controller
const addCategory = async (req, res) => {
  try {
    const { cat_name, cat_status, create_date } = req.body;

    // Create a new Category
    const newCategory = new Category({
      cat_name,
      cat_status,
      create_date,
    });
    if (req.file) {
      cloudinary.uploader.upload(req.file.path, async (err, result) => {
        if (err) {
          console.log(err);
          throw new Error("Image upload failed");
        }

        newCategory.image = result.secure_url;
        newCategory.publicid = result.public_id;

        //save the question to the database
        await newCategory.save();

        res.status(200).json({ success: true, data: newCategory });
      });
    } else {
      await newCategory.save();
      res.status(200).json({ success: true, data: newCategory });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update Category Api Controller
const updateCategory = async (req, res, next) => {
  try {
    const { cat_name, cat_status, create_date } = req.body;
    const { id } = req.params;

    // Find the category by ID
    const category = await Category.findById(id);

    if (!category) {
      return res
        .status(404)
        .json({ success: false, error: "Category not found" });
    }
    category.cat_name = cat_name;
    category.cat_status = cat_status;
    category.create_date = create_date;

    // Check if an image was uploaded
    if (req.file) {
      cloudinary.uploader.upload(req.file.path, async (err, result) => {
        if (err) {
          console.log(err);
          throw new Error("Image uplaod failed");
        }
        category.image = result.secure_url;
        category.publicid = result.public_id;

        await category.save();
        res.json({ success: true, data: category });
      });
    } else {
      await category.save();
      res.json({ success: true, data: category });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete Category Api Controller

const deleteCategory = async (req, res, next) => {
  const id = req.params.id;
  Category.findByIdAndDelete(id, function (err, categorydata) {
    if (err) {
      console.log(err);
      return res
        .status(500)
        .json({ error: "Failed to delete Category Data from database" });
    }
    if (!categorydata) {
      return res.status(404).json({ error: "Category Data not Found" });
    }
    if (categorydata?.publicid) {
      cloudinary.uploader.destroy(
        categorydata.publicid,
        function (err, result) {
          if (err) {
            console.log(err);
            return res
              .status(500)
              .json({ error: "Failded to delete image from Cloudinary" });
          }
          console.log(result);
          res
            .status(200)
            .json({ message: "Category data deleted successfully" });
        }
      );
    } else {
      res.status(200).json({ message: "Category data deleted successfully" });
    }
    // Delete image form Cloudinary
  });
};

module.exports = {
  getCategory,
  addCategory,
  updateCategory,
  deleteCategory,
  getSingleCategory,
};
