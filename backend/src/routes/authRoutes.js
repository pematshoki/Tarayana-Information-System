const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const { isAdmin } = require("../middleware/isAdmin");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
router.put("/update/:id", authController.updateUser);
router.put("/change-password/:id", authController.changePassword);
router.get("/users", authController.getAllUsers);
router.get("/user/:id", authController.getUserById);
router.get("/users/count", authController.getUserStats);
router.delete("/user/:id",isAdmin, authController.deleteUser);

router.get("/programme-officers", authController.getAllProgrammeOfficers);
router.get("/feild-officers", authController.getAllFieldOfficers);




module.exports = router;