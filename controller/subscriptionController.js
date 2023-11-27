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

const updateSubscription = async (req, res, next) => {
  const { id } = req.params;
  const { subscription } = req.body;

  // Validate if id is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid subscription ID' });
  }

  try {
    const data = await Subscription.findByIdAndUpdate(
      id,
      { $set: { subscription } },
      { new: true }
    );

    if (!data) {
      console.error(`Subscription with ID ${id} not found`);
      return res.status(404).json({ error: 'Subscription not found' });
    }

    console.log(`Subscription with ID ${id} updated successfully`);
    res.status(200).json({
      success: true,
      message: 'Subscription updated successfully!',
      data: subscription,
    });
  } catch (err) {
    console.error('Error updating subscription:', err);
    return res.status(500).json({
      success: false,
      message: 'Unknown error occurred!',
      errors: {
        common: {
          msg: 'Unknown error occurred!',
        },
      },
    });
  }
};



module.exports = {
    getSubscription,
    updateSubscription,
};
