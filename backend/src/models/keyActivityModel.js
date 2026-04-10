const mongoose = require("mongoose");

const keyActivitySchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Activity name is required"],
      trim: true,
    },
    // e.g. "L", "kg", "units", "sessions", "households"
    unit: {
      type: String,
      required: [true, "Unit is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    // Planned total for this activity across the project
    targetQuantity: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Activity name must be unique within a project
keyActivitySchema.index({ project: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("KeyActivity", keyActivitySchema);