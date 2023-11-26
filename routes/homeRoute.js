// external imports
const express = require("express");
const router = express.Router();
// internel imports
const {
 getAllData
} = require("../controller/homeController");



// get OK API ....
router.get("/", getAllData);

module.exports = router;
