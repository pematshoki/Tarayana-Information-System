const express = require("express");
const router = express.Router({ mergeParams: true }); // gives access to :projectId
const beneficiaryController = require("../controllers/beneficiaryController");
const { isAdmin } = require("../middleware/isAdmin");

router.get("/", beneficiaryController.getBeneficiaries);
router.post("/", beneficiaryController.createBeneficiary);

router.get("/:id", beneficiaryController.getBeneficiaryById);
router.put("/:id", beneficiaryController.updateBeneficiary);
router.delete("/:id", isAdmin, beneficiaryController.deleteBeneficiary);

// Add or update a single key activity quantity for one beneficiary
router.patch("/:id/activities", beneficiaryController.upsertBeneficiaryActivity);

module.exports = router;