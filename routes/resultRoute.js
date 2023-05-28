// external imports
const express = require("express");

const router = express.Router();

const {
    addResult,
    getResultbyId,
    getAllResult_BY_User,
    getAllResult
} = require("../controller/questionController");



// add result
router.post("/add",addResult); 

// get all result by userid 
router.get("/:userId", getAllResult_BY_User);

// get all result Data
router.get("/", getAllResult);

// get all result by userid 
router.get("/singleresult/:id", getResultbyId);

module.exports = router;
