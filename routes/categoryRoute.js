// external imports
const express = require("express");
const router = express.Router(); 

const { 
  getCategory, 
  addCategory, 
  updateCategory, 
  deleteCategory,
  getSingleCategory,
 } =
  require("../controller/categoryController");
const { 
  categoryValidator, 
  categoryValidationHandler} = require("../middleware/category/categoryValidator");
const upload = require("../middleware/uploadMiddleware");


  // get Category 
router.get("/",getCategory);

// get by Single Category
router.get("/:id",getSingleCategory); 

// post Category 
router.post("/add",
  upload,
  categoryValidator, 
  categoryValidationHandler,
  addCategory
); 
 

// delete Category
router.delete("/delete/:id",deleteCategory); 

// update Category
router.put("/update/:id",upload,updateCategory); 


module.exports = router;
