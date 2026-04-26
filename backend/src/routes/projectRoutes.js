const express = require("express");
const router = express.Router();
// Import the controller
const projectController = require("../controllers/projectController");
const { protect } = require("../middleware/authMiddleware");

// Check these carefully:
router.post("/", protect, projectController.createProject); 
router.get("/", protect, projectController.getAllProjects);
router.get("/summary/:id", projectController.getProjectView); 
router.put("/update/:id", protect, projectController.updateProject); 
router.delete("/:id", protect, projectController.deleteProject);


router.get("/programme-officer/:officerId", protect, projectController.getProjectsByProgrammeOfficer);
router.get("/field-officer/:officerId", protect, projectController.getProjectsByFieldOfficer);

router.post("/:id/complete", protect, projectController.markAsComplete);
router.post("/:id/inactive", protect, projectController.markAsInactive);

router.post("/:id/verify-data", protect, projectController.verifyProjectData);
router.post("/:id/alert", protect, projectController.sendDataAlert);


router.get('/dashboard-summary/:roleName/:userId', projectController.getDashboardSummary);

module.exports = router;