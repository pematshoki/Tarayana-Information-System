const Project = require("../models/projectModel");
const Beneficiary = require("../models/beneficiaryModel");
const mongoose = require("mongoose");
const User = require("../models/userModel"); // Import User model to get email
const { sendProjectAssignmentEmail } = require("../utils/email");
exports.createProject = async (req, res) => {
  try {
    const project = await Project.create(req.body);
    console.log("✅ Project Created:", project.projectName);

    if (project.fieldOfficer) {
      const officer = await User.findById(project.fieldOfficer);
      
      if (officer) {
        console.log("📧 Attempting to send email to:", officer.email);
        
        // Use officer.email or officer.username if 'name' is missing
        const displayName = officer.name || officer.email.split('@')[0];

        sendProjectAssignmentEmail(officer.email, displayName, project.projectName)
          .then(() => console.log("🚀 Email sent successfully to", officer.email))
          .catch(err => console.error("❌ Nodemailer Error:", err));
      } else {
        console.log("⚠️ Field Officer ID found but User not found in database.");
      }
    }

    res.status(201).json({ success: true, data: project });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


exports.getProjectView = async (req, res) => {
  try { 
    const { id } = req.params;

    // 1. Fetch Project with all details
    const project = await Project.findById(id)
      .populate("donor partner programme fieldOfficer");
    
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });

    // 2. Fetch all raw beneficiaries with all fields for the table
    const beneficiaries = await Beneficiary.find({ projectId: id });

    // 3. Helper to parse "3 200" or "1 500" strings
    const parseSpecs = (specsArray) => {
      if (!specsArray || !Array.isArray(specsArray)) return 0;
      return specsArray.reduce((total, str) => {
        const numbers = str.match(/\d+/g); 
        if (numbers && numbers.length >= 2) {
          // "3 200" -> 3 * 200 = 600
          return total + (parseInt(numbers[0]) * parseInt(numbers[1]));
        } else if (numbers && numbers.length === 1) {
          // "500L" -> 500
          return total + parseInt(numbers[0]);
        }
        return total;
      }, 0);
    };

    // 4. Calculate Top-Level Totals
    const summary = beneficiaries.reduce((acc, curr) => {
      acc.totalDirect += 1;
      acc.totalIndirectMale += curr.indirectBeneficiaries?.male || 0;
      acc.totalIndirectFemale += curr.indirectBeneficiaries?.female || 0;
      
      // Sum gender of direct beneficiaries
      if (curr.gender?.toLowerCase() === 'm') acc.directMale += 1;
      if (curr.gender?.toLowerCase() === 'f') acc.directFemale += 1;

      return acc;
    }, { totalDirect: 0, directMale: 0, directFemale: 0, totalIndirectMale: 0, totalIndirectFemale: 0 });

    // 5. Aggregate Geographic & Activity Summary
    const geoStats = await Beneficiary.aggregate([
      { $match: { projectId: new mongoose.Types.ObjectId(id) } },
      { $unwind: "$keyActivities" },
      {
        $group: {
          _id: {
            dzongkhag: "$dzongkhag",
            gewog: "$gewog",
            village: "$village",
            activity: "$keyActivities.activityName"
          },
          totalQty: { $sum: "$keyActivities.totalQuantity" },
          unit: { $first: "$keyActivities.unit" },
          allSpecs: { $push: "$keyActivities.specifications" },
          households: { $addToSet: "$houseNo" }
        }
      }
    ]);

    // 6. Format Geographic Breakdown for the UI
    const geographicBreakdown = geoStats.reduce((acc, curr) => {
      const locKey = `${curr._id.dzongkhag}-${curr._id.gewog}-${curr._id.village}`;
      if (!acc[locKey]) {
        acc[locKey] = {
          location: {
            dzongkhag: curr._id.dzongkhag,
            gewog: curr._id.gewog,
            village: curr._id.village
          },
          totalHouseholds: 0,
          activities: []
        };
      }

      const flatSpecs = curr.allSpecs.flat();
      const calculatedCapacity = parseSpecs(flatSpecs);

      acc[locKey].activities.push({
        activityName: curr._id.activity,
        totalQuantity: curr.totalQty,
        unit: curr.unit,
        totalCapacitySum: calculatedCapacity,
        remarks: flatSpecs
      });
      
      acc[locKey].totalHouseholds += curr.households.length;
      return acc;
    }, {});

    // 7. Global Activity Totals (Summary of the whole project)
    const globalActivityTotals = geoStats.reduce((acc, curr) => {
      if (!acc[curr._id.activity]) {
        acc[curr._id.activity] = { quantity: 0, capacity: 0, unit: curr.unit };
      }
      acc[curr._id.activity].quantity += curr.totalQty;
      acc[curr._id.activity].capacity += parseSpecs(curr.allSpecs.flat());
      return acc;
    }, {});

    // Final Combined Response
    res.status(200).json({
      success: true,
      project, // All project fields included here
      projectSummary: {
        ...summary,
        globalActivityTotals
      },
      geographicBreakdown: Object.values(geographicBreakdown),
      beneficiaryList: beneficiaries // All beneficiary fields included here
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate("programme donor partner fieldOfficer");
    res.status(200).json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add this to your projectController.js
exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    // Delete all beneficiaries linked to this project first
    await Beneficiary.deleteMany({ projectId: id });

    // Now delete the project
    await Project.findByIdAndDelete(id);

    res.status(200).json({ 
      success: true, 
      message: "Project and all associated beneficiaries deleted successfully" 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};