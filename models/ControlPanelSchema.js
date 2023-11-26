const mongoose = require("mongoose");

const controlPanelSchema = mongoose.Schema(
  {
    image: {
      type: String,
    },
    title: {
      type: String,
    },
    subtitle: {
      type: String,
    },
    buttonName: {
      type: String,
    },
    link: {
      type: String,
    },
    publicid: {
      type: String,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    text:{
      type:String,
    }
  },
  { timestamps: true }
);

const ControlPanel = mongoose.model("homeSettings", controlPanelSchema);
module.exports = ControlPanel;
