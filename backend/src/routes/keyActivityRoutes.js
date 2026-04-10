const express = require("express");
const router = express.Router({ mergeParams: true }); // gives access to :projectId
const keyActivityController = require("../controllers/keyActivityController");
const { isAdmin } = require("../middleware/isAdmin");

router.get("/", keyActivityController.getKeyActivities);
router.post("/", isAdmin, keyActivityController.createKeyActivity);

router.get("/:id", keyActivityController.getKeyActivityById);
router.put("/:id", isAdmin, keyActivityController.updateKeyActivity);
router.delete("/:id", isAdmin, keyActivityController.deleteKeyActivity);

module.exports = router;