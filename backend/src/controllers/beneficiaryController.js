const Beneficiary = require("../models/beneficiaryModel");
const KeyActivity = require("../models/keyActivityModel");

// @desc    Get all beneficiaries in a project
// @route   GET /api/projects/:projectId/beneficiaries
// @access  Private
const getBeneficiaries = async (req, res, next) => {
  try {
    const { gender, gewog } = req.query;
    const filter = { project: req.params.projectId };
    if (gender) filter.gender = gender;
    if (gewog)  filter.gewog  = { $regex: gewog, $options: "i" };

    const beneficiaries = await Beneficiary.find(filter)
      .populate("activities.keyActivity", "name unit")
      .populate("assignedFieldOfficer", "email")
      .sort("-createdAt");

    res.json({ success: true, count: beneficiaries.length, data: beneficiaries });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single beneficiary
// @route   GET /api/projects/:projectId/beneficiaries/:id
// @access  Private
const getBeneficiaryById = async (req, res, next) => {
  try {
    const beneficiary = await Beneficiary.findOne({
      _id: req.params.id,
      project: req.params.projectId,
    })
      .populate("activities.keyActivity", "name unit description")
      .populate("assignedFieldOfficer", "email")
      .populate("registeredBy", "email");

    if (!beneficiary) {
      return res.status(404).json({ success: false, message: "Beneficiary not found" });
    }
    res.json({ success: true, data: beneficiary });
  } catch (error) {
    next(error);
  }
};

// @desc    Register a beneficiary with their key activity quantities
// @route   POST /api/projects/:projectId/beneficiaries
// @access  Private
//
// Body example:
// {
//   "firstName": "Karma",
//   "lastName": "Dorji",
//   "gender": "male",
//   "cidNumber": "11111111111",
//   "dzongkhag": "Thimphu",
//   "gewog": "Kawang",
//   "village": "Tenchholing",
//   "activities": [
//     { "keyActivity": "<keyActivityId>", "quantity": 500 },
//     { "keyActivity": "<keyActivityId>", "quantity": 2   }
//   ]
// }
const createBeneficiary = async (req, res, next) => {
  try {
    const { activities } = req.body;

    // Ensure all referenced activities belong to this project
    if (activities && activities.length > 0) {
      const ids = activities.map((a) => a.keyActivity);
      const valid = await KeyActivity.find({
        _id: { $in: ids },
        project: req.params.projectId,
        isActive: true,
      });
      if (valid.length !== ids.length) {
        return res.status(400).json({
          success: false,
          message: "One or more key activities do not belong to this project",
        });
      }
    }

    const beneficiary = await Beneficiary.create({
      ...req.body,
      project:      req.params.projectId,
      registeredBy: req.user._id,
    });

    const populated = await beneficiary.populate(
      "activities.keyActivity",
      "name unit"
    );

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Update beneficiary
// @route   PUT /api/projects/:projectId/beneficiaries/:id
// @access  Private
const updateBeneficiary = async (req, res, next) => {
  try {
    if (req.body.activities && req.body.activities.length > 0) {
      const ids = req.body.activities.map((a) => a.keyActivity);
      const valid = await KeyActivity.find({
        _id: { $in: ids },
        project: req.params.projectId,
        isActive: true,
      });
      if (valid.length !== ids.length) {
        return res.status(400).json({
          success: false,
          message: "One or more key activities do not belong to this project",
        });
      }
    }

    const beneficiary = await Beneficiary.findOneAndUpdate(
      { _id: req.params.id, project: req.params.projectId },
      req.body,
      { new: true, runValidators: true }
    ).populate("activities.keyActivity", "name unit");

    if (!beneficiary) {
      return res.status(404).json({ success: false, message: "Beneficiary not found" });
    }
    res.json({ success: true, data: beneficiary });
  } catch (error) {
    next(error);
  }
};

// @desc    Add or update ONE activity entry for a beneficiary
//          (useful for field data entry one activity at a time)
// @route   PATCH /api/projects/:projectId/beneficiaries/:id/activities
// @access  Private
//
// Body: { "keyActivity": "<id>", "quantity": 200, "notes": "optional" }
const upsertBeneficiaryActivity = async (req, res, next) => {
  try {
    const { keyActivity, quantity, notes } = req.body;

    const validActivity = await KeyActivity.findOne({
      _id: keyActivity,
      project: req.params.projectId,
      isActive: true,
    });
    if (!validActivity) {
      return res.status(400).json({
        success: false,
        message: "Key activity not found in this project",
      });
    }

    const beneficiary = await Beneficiary.findOne({
      _id: req.params.id,
      project: req.params.projectId,
    });
    if (!beneficiary) {
      return res.status(404).json({ success: false, message: "Beneficiary not found" });
    }

    const idx = beneficiary.activities.findIndex(
      (a) => a.keyActivity.toString() === keyActivity
    );

    if (idx >= 0) {
      beneficiary.activities[idx].quantity = quantity;
      if (notes !== undefined) beneficiary.activities[idx].notes = notes;
    } else {
      beneficiary.activities.push({ keyActivity, quantity, notes });
    }

    await beneficiary.save();
    const populated = await beneficiary.populate("activities.keyActivity", "name unit");
    res.json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete beneficiary
// @route   DELETE /api/projects/:projectId/beneficiaries/:id
// @access  Private / isAdmin
const deleteBeneficiary = async (req, res, next) => {
  try {
    const beneficiary = await Beneficiary.findOneAndDelete({
      _id: req.params.id,
      project: req.params.projectId,
    });
    if (!beneficiary) {
      return res.status(404).json({ success: false, message: "Beneficiary not found" });
    }
    res.json({ success: true, message: "Beneficiary removed" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBeneficiaries,
  getBeneficiaryById,
  createBeneficiary,
  updateBeneficiary,
  upsertBeneficiaryActivity,
  deleteBeneficiary,
};