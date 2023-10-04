const mongoose = require("mongoose");

const controlPanelSchema = mongoose.Schema({
    banner: {
        type: 'string',
    },
    title:{
        type:'string',
    },
    publicid:{
        type:String,
    },
    status: {
        type:String,
        trim: true,
        lowercase: true, 
        required : true,
    },
    create_date: {
        type: Date,
    }
},{timestamps: true});

const ControlPanel = mongoose.model("homeSettings",controlPanelSchema); 
module.exports = ControlPanel;