const mongoose = require("mongoose");
const Project = require("../models/projectModel");
const KeyActivity = require("../models/keyActivityModel");
const Beneficiary = require("../models/beneficiaryModel");
const Programme = require("../models/programmeModel");
const User = require("../models/userModel");
const Role = require("../models/roleModel");

// ─── Hardcoded Dzongkhags — no DB needed, just a dropdown ────────────────────
const DZONGKHAGS = [
  { name: "Bumthang",         code: "BUM" },
  { name: "Chhukha",          code: "CHH" },
  { name: "Dagana",           code: "DAG" },
  { name: "Gasa",             code: "GAS" },
  { name: "Haa",              code: "HAA" },
  { name: "Lhuentse",         code: "LHU" },
  { name: "Mongar",           code: "MON" },
  { name: "Paro",             code: "PAR" },
  { name: "Pemagatshel",      code: "PEM" },
  { name: "Punakha",          code: "PUN" },
  { name: "Samdrup Jongkhar", code: "SAM" },
  { name: "Samtse",           code: "SAT" },
  { name: "Sarpang",          code: "SAR" },
  { name: "Thimphu",          code: "THI" },
  { name: "Trashigang",       code: "TRG" },
  { name: "Trashi Yangtse",   code: "TRY" },
  { name: "Trongsa",          code: "TRO" },
  { name: "Tsirang",          code: "TSI" },
  { name: "Wangdue Phodrang", code: "WAN" },
  { name: "Zhemgang",         code: "ZHE" },
];

// ─── Helper: find users by role name ─────────────────────────────────────────
// Matches role name case-insensitively against your Role collection,
// then returns all Users with that roleId.
// Adjust the role name strings in getProjectFormData() below if your DB
// stores them differently (e.g. "donor" vs "Donor").
const getUsersByRoleName = async (roleName) => {
  const role = await Role.findOne({
    name: { $regex: new RegExp(`^${roleName}$`, "i") },
  });
  if (!role) return [];
  return User.find({ roleId: role._id }).select("_id email");
};

// @desc    Get all dropdown data for the Create Project form in one request
// @route   GET /api/projects/form-data
// @access  Private
const getProjectFormData = async (req, res, next) => {
  try {
    // Fetch programmes, donors, partners, field officers in parallel
    const [programmes, donors, partners, fieldOfficers] = await Promise.all([
      Programme.find({ isActive: true }).select("_id name").sort("name"),
      getUsersByRoleName("Donor"),
      getUsersByRoleName("Partner"),
      getUsersByRoleName("Field Officer"),
    ]);

    res.json({
      success: true,
      data: {
        dzongkhags: DZONGKHAGS,  // hardcoded — no model or DB round-trip
        programmes,
        donors,
        partners,
        fieldOfficers,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res, next) => {
  try {
    const { programme, status } = req.query;
    const filter = {};
    if (programme) filter.programme = programme;
    if (status)    filter.status    = status;

    const projects = await Project.find(filter)
      .populate("programme", "name")
      .populate("fieldOfficer", "email")
      .sort("-createdAt");

    res.json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single project with its key activities and beneficiary count
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("programme", "name")
      .populate("fieldOfficer", "email");

    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    const keyActivities = await KeyActivity.find({
      project: project._id,
      isActive: true,
    });

    const beneficiaryCount = await Beneficiary.countDocuments({
      project: project._id,
    });

    res.json({
      success: true,
      data: { ...project.toObject(), keyActivities, beneficiaryCount },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create project — pass keyActivities[] in the same request body
// @route   POST /api/projects
// @access  Private / isAdmin
//
// Body:
// {
//   "name": "Clean Water Chhukha",
//   "dzongkhag": "Chhukha",           ← plain string from the hardcoded list
//   "startDate": "2025-01-01",
//   "endDate":   "2025-12-31",
//   "donor":        "<userId>",
//   "partner":      "<userId>",
//   "programme":    "<programmeId>",
//   "fieldOfficer": "<userId>",
//   "beneficiaryTarget": 300,
//   "description": "...",
//   "keyActivities": [
//     { "name": "Build Water Tank", "unit": "L",        "targetQuantity": 100000 },
//     { "name": "Hygiene Training", "unit": "sessions", "targetQuantity": 600    }
//   ]
// }
const createProject = async (req, res, next) => {
  try {
    const { keyActivities, ...projectData } = req.body;

    const project = await Project.create({
      ...projectData,
      createdBy: req.user._id,
    });

    let createdActivities = [];
    if (Array.isArray(keyActivities) && keyActivities.length > 0) {
      const toInsert = keyActivities.map((a) => ({
        project:        project._id,
        name:           a.name,
        unit:           a.unit,
        description:    a.description    || "",
        targetQuantity: a.targetQuantity || 0,
      }));
      createdActivities = await KeyActivity.insertMany(toInsert);
    }

    res.status(201).json({
      success: true,
      data: { ...project.toObject(), keyActivities: createdActivities },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private / isAdmin
const updateProject = async (req, res, next) => {
  try {
    delete req.body.createdBy;

    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("programme", "name")
      .populate("fieldOfficer", "email");

    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

// @desc    Suspend (soft-delete) project
// @route   DELETE /api/projects/:id
// @access  Private / isAdmin
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { status: "suspended" },
      { new: true }
    );
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }
    res.json({ success: true, message: "Project suspended", data: project });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// ACTIVITY SUMMARY
// For each KeyActivity in the project, sums the quantity recorded across
// ALL beneficiaries. This is what drives the project dashboard total display
// e.g. "Build Water Tank — 5000L total across 12 beneficiaries".
// ─────────────────────────────────────────────────────────────────────────────

// @desc    Aggregated key activity totals across all beneficiaries in a project
// @route   GET /api/projects/:id/activity-summary
// @access  Private
const getActivitySummary = async (req, res, next) => {
  try {
    const projectId = new mongoose.Types.ObjectId(req.params.id);

    const project = await Project.findById(projectId).select("name beneficiaryTarget");
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    const keyActivities = await KeyActivity.find({
      project: projectId,
      isActive: true,
    });

    // Unwind each beneficiary's activities array and group by keyActivity
    const aggregation = await Beneficiary.aggregate([
      { $match: { project: projectId } },
      { $unwind: "$activities" },
      {
        $group: {
          _id:              "$activities.keyActivity",
          totalQuantity:    { $sum: "$activities.quantity" },
          beneficiaryCount: { $sum: 1 },
        },
      },
    ]);

    // Build lookup map for O(1) access
    const aggMap = {};
    aggregation.forEach((a) => {
      aggMap[a._id.toString()] = {
        totalQuantity:    a.totalQuantity,
        beneficiaryCount: a.beneficiaryCount,
      };
    });

    const summary = keyActivities.map((ka) => {
      const stats = aggMap[ka._id.toString()] || {
        totalQuantity: 0,
        beneficiaryCount: 0,
      };
      return {
        activityId:       ka._id,
        name:             ka.name,
        unit:             ka.unit,
        description:      ka.description,
        targetQuantity:   ka.targetQuantity,
        totalQuantity:    stats.totalQuantity,
        beneficiaryCount: stats.beneficiaryCount,
        completionPercentage:
          ka.targetQuantity > 0
            ? Math.min(
                100,
                ((stats.totalQuantity / ka.targetQuantity) * 100).toFixed(1)
              )
            : null,
      };
    });

    const totalBeneficiaries = await Beneficiary.countDocuments({
      project: projectId,
    });

    res.json({
      success: true,
      project: {
        _id:               project._id,
        name:              project.name,
        beneficiaryTarget: project.beneficiaryTarget,
      },
      totalBeneficiaries,
      summary,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProjectFormData,
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getActivitySummary,
};