// This router handles GET requests to the /activity endpoint
require("dotenv").config();
const express = require("express");
const router = express.Router();

// @route GET /activity
// @desc Retrieve a random activity from the Bored API
router.get("/", (req, res) => {
    return;
});

module.exports = router;