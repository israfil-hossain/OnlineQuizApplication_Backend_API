// external imports
const express = require("express");
const router = express.Router();

const { getSubscription, updateSubscription } = require("../controller/subscriptionController");


// get Subscription
router.get("/", getSubscription);

// update Subscription
router.put("/update/:id", updateSubscription);

module.exports = router;
