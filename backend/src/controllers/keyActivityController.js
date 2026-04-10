const KeyActivity = require("../models/keyActivityModel");

// @desc    Get all key activities for a project
// @route   GET /api/projects/:projectId/key-activities
// @access  Private
const getKeyActivities = async (req, res, next) => {
  try {
    const activities = await KeyActivity.find({
      project: req.params.projectId,
      isActive: true,
    }).sort("name");
    res.json({ success: true, count: activities.length, data: activities });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single key activity
// @route   GET /api/projects/:projectId/key-activities/:id
// @access  Private
const getKeyActivityById = async (req, res, next) => {
  try {
    const activity = await KeyActivity.findOne({
      _id: req.params.id,
      project: req.params.projectId,
    });
    if (!activity) {
      return res.status(404).json({ success: false, message: "Key activity not found" });
    }
    res.json({ success: true, data: activity });
  } catch (error) {
    next(error);
  }
};

// @desc    Add key activity to a project
// @route   POST /api/projects/:projectId/key-activities
// @access  Private / isAdmin
const createKeyActivity = async (req, res, next) => {
  try {
    const activity = await KeyActivity.create({
      ...req.body,
      project: req.params.projectId,
    });
    res.status(201).json({ success: true, data: activity });
  } catch (error) {
    next(error);
  }
};

// @desc    Update key activity
// @route   PUT /api/projects/:projectId/key-activities/:id
// @access  Private / isAdmin
const updateKeyActivity = async (req, res, next) => {
  try {
    const activity = await KeyActivity.findOneAndUpdate(
      { _id: req.params.id, project: req.params.projectId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!activity) {
      return res.status(404).json({ success: false, message: "Key activity not found" });
    }
    res.json({ success: true, data: activity });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove (deactivate) key activity
// @route   DELETE /api/projects/:projectId/key-activities/:id
// @access  Private / isAdmin
const deleteKeyActivity = async (req, res, next) => {
  try {
    const activity = await KeyActivity.findOneAndUpdate(
      { _id: req.params.id, project: req.params.projectId },
      { isActive: false },
      { new: true }
    );
    if (!activity) {
      return res.status(404).json({ success: false, message: "Key activity not found" });
    }
    res.json({ success: true, message: "Key activity removed" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getKeyActivities,
  getKeyActivityById,
  createKeyActivity,
  updateKeyActivity,
  deleteKeyActivity,
};