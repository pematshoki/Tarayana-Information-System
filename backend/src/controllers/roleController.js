const Role = require("../models/roleModel");

exports.createRole = async (req, res) => {

  try {

    const { roleName, roleDescription } = req.body;

    const existing = await Role.findOne({ roleName });

    if (existing) {
      return res.status(400).json({ message: "Role already exists" });
    }

    const role = await Role.create({
      roleName,
      roleDescription
    });

    res.json({
      message: "Role created successfully",
      role
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }

};