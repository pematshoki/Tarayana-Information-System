const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");
const { isAdmin } = require("../middleware/isAdmin");

// Nested routers — mounted here so they inherit :projectId via mergeParams
const keyActivityRoutes  = require("./keyActivityRoutes");
const beneficiaryRoutes  = require("./beneficiaryRoutes");

router.use("/:projectId/key-activities", keyActivityRoutes);
router.use("/:projectId/beneficiaries",  beneficiaryRoutes);

// All dropdown data for the Create Project form in one call
router.get("/form-data", projectController.getProjectFormData);

router.get("/", projectController.getProjects);
router.post("/", isAdmin, projectController.createProject);

router.get("/:id", projectController.getProjectById);
router.put("/:id", isAdmin, projectController.updateProject);
router.delete("/:id", isAdmin, projectController.deleteProject);

// Aggregated key activity totals across all beneficiaries
router.get("/:id/activity-summary", projectController.getActivitySummary);

module.exports = router;