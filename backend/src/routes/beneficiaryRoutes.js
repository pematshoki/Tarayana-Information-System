const express = require("express");
const router = express.Router();
const beneficiaryController = require("../controllers/beneficiaryController");

// Path: /api/beneficiaries
router.post("/", beneficiaryController.createBeneficiary);
router.get("/project/:projectId", beneficiaryController.getProjectBeneficiaries);

router.delete("/:id", beneficiaryController.deleteBeneficiary);

module.exports = router;