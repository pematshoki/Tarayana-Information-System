const express = require("express");
const router = express.Router();

const annualEventController = require("../controllers/annualEventController");

router.post("/main-event", annualEventController.createAnnualEvent);
router.post("/event", annualEventController.createEvent);

router.put("/annual-event/:id", annualEventController.updateAnnualEvent);
router.delete("/annual-event/:id", annualEventController.deleteAnnualEvent);


router.get("/events/:annualEventId",annualEventController.getEventsByAnnualEvent);

router.put("/event/:id",annualEventController.updateEvent);
router.delete("/event/:id",annualEventController.deleteEvent);

module.exports = router;