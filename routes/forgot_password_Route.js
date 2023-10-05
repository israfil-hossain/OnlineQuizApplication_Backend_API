// external imports 
const express = require("express"); 
const router = express.Router(); 

// internel imports 
const { 
    forgotPassword,
    resetPassword
} = require("../controller/forgotPasswordController");

// get User API .... 
router.post("/forgot-password",forgotPassword); 
router.post('/reset-password/:token', resetPassword);




module.exports = router; 