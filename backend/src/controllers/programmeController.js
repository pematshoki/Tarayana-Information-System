const Programme = require("../models/programmeModel");
const Project = require("../models/projectModel");
// CREATE
exports.createProgramme = async (req, res) => {
  try {
    const { programmeName, programmeDescription } = req.body;

    const existing = await Programme.findOne({ programmeName });
    if (existing) {
      return res.status(400).json({ message: "Programme already exists" });
    }

    const programme = await Programme.create({ programmeName, programmeDescription });
    res.status(201).json({
      message: "Programme created successfully",
      programme
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProgrammes = async (req, res) => {
  try {
    const programmes = await Programme.aggregate([
      {
        $lookup: {
          from: "projects",
          localField: "_id",
          foreignField: "programme",
          as: "projects",
        },
      },
      {
        $addFields: {
          projectCount: { $size: "$projects" },
        },
      },
      {
        $project: {
          programmeName: 1,
          programmeDescription: 1,
          projectCount: 1,
        },
      },
    ]);

    res.json({ programmes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET BY ID
exports.getProgrammeById = async (req, res) => {
  try {
    const { id } = req.params;
    const programme = await Programme.findById(id);
    if (!programme) {
      return res.status(404).json({ message: "Programme not found" });
    }
    res.json({ programme });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE
exports.updateProgramme = async (req, res) => {
  try {
    const { id } = req.params;
    const { programmeName, programmeDescription } = req.body;

    const programme = await Programme.findByIdAndUpdate(
      id,
      { programmeName, programmeDescription },
      { new: true, runValidators: true }
    );

    if (!programme) {
      return res.status(404).json({ message: "Programme not found" });
    }

    res.json({
      message: "Programme updated successfully",
      programme
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE
exports.deleteProgramme = async (req, res) => {
  try {
    const { id } = req.params;

    const programme = await Programme.findByIdAndDelete(id);
    if (!programme) {
      return res.status(404).json({ message: "Programme not found" });
    }

    res.json({ message: "Programme deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};