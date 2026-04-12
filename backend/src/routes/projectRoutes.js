const express = require("express");
const router = express.Router();
// Import the controller
const projectController = require("../controllers/projectController");

// Check these carefully:
router.post("/", projectController.createProject); 
router.get("/", projectController.getAllProjects);
router.get("/summary/:id", projectController.getProjectView); 
router.get("/programme/:id", projectController.getProjectsByProgramme);
router.delete("/:id", projectController.deleteProject);

module.exports = router;