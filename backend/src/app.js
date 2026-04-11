// src/app.js

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const roleRoutes = require("./routes/roleRoutes");
const programmeRoutes = require("./routes/programmeRoutes");
const donorpartnerRoutes = require("./routes/donorpartnerRoutes")


const projectRoutes = require("./routes/projectRoutes")
const beneficiaryRoutes = require("./routes/beneficiaryRoutes");


const errorHandler = require("./middleware/errorHandler");

const app = express();


// Enable CORS
app.use(cors());

// Parse JSON request body
app.use(express.json());

// Parse URL encoded data
app.use(express.urlencoded({ extended: true }));

// Routes


app.use("/api/auth", authRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/programmes", programmeRoutes);
app.use("/api/donor-partner", donorpartnerRoutes)

// Project
app.use("/api/projects", projectRoutes);

// beneficiary
app.use("/api/beneficiaries", beneficiaryRoutes);


// Health check route
app.get("/", (req, res) => {
  res.json({
    message: "API is running"
  });
});






app.use(errorHandler);

module.exports = app;