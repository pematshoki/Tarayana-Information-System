const express = require("express");
const router = express.Router();
const beneficiaryController = require("../controllers/beneficiaryController");

// Path: /api/beneficiaries
router.post("/", beneficiaryController.createBeneficiary);
router.get("/project/:projectId", beneficiaryController.getProjectBeneficiaries);
router.get("/", beneficiaryController.getAllBeneficiaries);
router.delete("/:id", beneficiaryController.deleteBeneficiary);
router.get("/getcount", beneficiaryController.getBeneficiaryCount);

module.exports = router;