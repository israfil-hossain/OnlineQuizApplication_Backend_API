// external imports
const express = require("express");
const router = express.Router();
// internel imports
const {
  getAllData,
  addControlPanel,
  updateControlPanel,
  deleteControlPanel
} = require("../controller/controlPanel");

const {
  controlpanelValidator,
  controlpanelValidationHandler,
} = require("../middleware/controlpanel/controlpanelValidator");
const upload = require("../middleware/uploadMiddleware");

// get User API ....
router.get("/", getAllData);
router.post(
  "/add",
  upload,
  controlpanelValidator,
  controlpanelValidationHandler,
  addControlPanel
);
router.put("/update/:id", upload, updateControlPanel);
router.delete("/delete/:id",deleteControlPanel)
module.exports = router;
