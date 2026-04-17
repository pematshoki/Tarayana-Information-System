const express = require("express");
const router = express.Router();
// Import the controller
const reportController = require("../controllers/reportController");

// Check these carefully:
router.post("/generate", reportController.generateReport);

module.exports = router;