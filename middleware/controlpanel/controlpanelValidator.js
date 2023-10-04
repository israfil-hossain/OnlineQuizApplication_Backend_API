// external imports
const { check, validationResult } = require("express-validator");

const controlpanelValidator = [
  check("title")
    .isLength({
      min: 2,
    })
    .withMessage("Home Page settings title is required !"),
  check("status")
    .isLength({
      min: 3,
    })
    .withMessage("Home Page settings Status is required !"),
];

const controlpanelValidationHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    next();
  } else {
    res.status(500).json({
      errors: errors.mapped(),
    });
  }
};

module.exports = {
  controlpanelValidator,
  controlpanelValidationHandler,
};
