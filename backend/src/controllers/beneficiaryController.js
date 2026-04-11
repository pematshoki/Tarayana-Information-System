const Beneficiary = require("../models/beneficiaryModel");
const Project = require("../models/projectModel");

/**
 * @desc    Create a new beneficiary with project-based Dzongkhag validation
 * @route   POST /api/beneficiaries
 */
exports.createBeneficiary = async (req, res) => {
  try {
    const {
      projectId,
      year,
      gender,
      cid,
      name,
      dzongkhag,
      village,
      gewog,
      houseNo,
      thramNo,
      indirectBeneficiaries,
      keyActivities
    } = req.body;

    // 1. Basic Field Validation (Requirement: all except indirectBeneficiaries)
    if (!projectId || !year || !gender || !cid || !name || !dzongkhag || !village || !gewog || !houseNo || !thramNo) {
      return res.status(400).json({
        success: false,
        message: "All fields are required except indirect beneficiaries."
      });
    }

    // 2. Fetch the project to validate Dzongkhag
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    // 3. Dzongkhag validation (Must match project's selected dzongkhags)
    const allowedDzongkhags = project.dzongkhag.map(d => d.toLowerCase());
    if (!allowedDzongkhags.includes(dzongkhag.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: `Invalid Dzongkhag. This project only operates in: ${project.dzongkhag.join(", ")}`
      });
    }

    // 4. Check if Beneficiary with this CID already exists in THIS project
    const existingBeneficiary = await Beneficiary.findOne({ cid, projectId });
    if (existingBeneficiary) {
      return res.status(400).json({
        success: false,
        message: "A beneficiary with this CID is already registered to this project."
      });
    }

    // 5. Create the Beneficiary
    const newBeneficiary = await Beneficiary.create({
      projectId,
      year,
      gender,
      cid,
      name,
      dzongkhag,
      village,
      gewog,
      houseNo,
      thramNo,
      indirectBeneficiaries,
      keyActivities
    });

    res.status(201).json({
      success: true,
      message: "Beneficiary registered successfully",
      data: newBeneficiary
    });

  } catch (error) {
    // This catches CID 11-digit validation or Gender enum errors from the model
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get all beneficiaries for a specific project
 * @route   GET /api/beneficiaries/project/:projectId
 */
exports.getProjectBeneficiaries = async (req, res) => {
  try {
    const { projectId } = req.params;

    const beneficiaries = await Beneficiary.find({ projectId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: beneficiaries.length,
      data: beneficiaries
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Add this to your beneficiaryController.js
exports.deleteBeneficiary = async (req, res) => {
  try {
    const { id } = req.params;

    const beneficiary = await Beneficiary.findByIdAndDelete(id);

    if (!beneficiary) {
      return res.status(404).json({ success: false, message: "Beneficiary not found" });
    }

    res.status(200).json({ 
      success: true, 
      message: "Beneficiary deleted successfully" 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};