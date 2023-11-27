//external Import
const Subscription = require("../models/SubscriptionSchema");

// get All User Api  Controller
const getSubscription = async (req, res, next) => {
  try {
    const subscriptions = await Subscription.find();
    
    // Check if any subscriptions are found
    if (subscriptions.length > 0) {
      const firstSubscription = subscriptions[0];
      res.json(firstSubscription);
    } else {
      res.json({}); // or you can send an appropriate response for an empty array
    }
  } catch (err) {
    return res.status(500).json({
      errors: {
        common: {
          msg: `Unknown error occurred! ${err}`,
        },
      },
    });
  }
};


async function updateSubscription(req, res, next) {
  const { id } = req.params;
  const { subscription } = req.body;

  try {
    const data = await Subscription.findByIdAndUpdate(
      id,
      { $set: { subscription } },
      { new: true }
    );

    if (!data) {
      return res.status(404).json({ error: 'Subscription not found' });
    }
    res.status(200).json({
      success: true,
      message: "Subscription Update Successfully !",
      data: subscription,
    });

   
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
