const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

  roleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  }

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);