const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
  subscription:{
    type:String,
    required:[true, "Please provide Subscription Information"]
  },
},{ timestamps: true });


const Subscription = mongoose.model('subscription',SubscriptionSchema);
module.exports = Subscription;
