//external Import
const Subscription = require("../models/SubscriptionSchema");

// get All User Api  Controller
const getSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.find();
    res.json(subscription);
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

async function updateSubscription(req, res, next) {
  try {
    const { subscription } = req.body;
    const { id } = req.params;

    // Find the question by ID
    let foundSubscription  = await Subscription.findById(id);
    // let foundSubscription = await Subscription.findOne({ subscription });
    if (!foundSubscription) {
      foundSubscription = new Subscription({ subscription });
      await foundSubscription.save();
      res.status(200).json({
        success: true,
        message: "Subscription Add Successfully",
        data: foundSubscription,
      });
      
    } else {
      foundSubscription.subscription = subscription;
      await foundSubscription.save();
      res.status(200).json({
        success: true,
        message: "Subscription Update Successfully !",
        data: foundSubscription,
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

module.exports = {
    getSubscription,
    updateSubscription,
};
