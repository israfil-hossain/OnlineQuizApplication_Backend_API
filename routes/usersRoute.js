// external imports 
const express = require("express"); 
const { check } = require("express-validator");
const mongoose = require("mongoose"); 
 
// internel imports 
const { 
    getUsers,
    getSingleUser, 
    addUser,
    updateUser, 
    deleteUser, 
} = require("../controller/usersController");
const upload = require("../middleware/uploadMiddleware");

const {addUserValidators,addUserValidationHandler } = require("../middleware/users/userValidator"); 

const router = express.Router(); 


// get User API .... 
router.get("/", getUsers ); 

//get Single User Api ... 
router.get("/:id",getSingleUser); 

// add User API ......
router.post("/adduser",
    upload,
    addUserValidators,
    addUserValidationHandler,
    addUser
); 

// update User Api 
router.put('/update/:id',upload,updateUser); 

//delete User Api 
router.delete('/delete/:id',deleteUser);


module.exports = router; 