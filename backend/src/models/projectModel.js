const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
    },

    // Plain string — comes from the hardcoded DZONGKHAGS list, no ObjectId needed
    dzongkhag: {
      type: String,
      required: [true, "Dzongkhag is required"],
      trim: true,
    },

    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },

    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },

    // References a User with role "Donor"
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Donor is required"],
    },

    // References a User with role "Partner"
    partner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Partner is required"],
    },

    programme: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Programme",
      required: [true, "Programme is required"],
    },

    // References a User with role "Field Officer"
    fieldOfficer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Field officer is required"],
    },

    description: {
      type: String,
      trim: true,
    },

    // Planned number of beneficiaries — the "quantity" field on the form
    beneficiaryTarget: {
      type: Number,
      required: [true, "Beneficiary target is required"],
      min: [1, "Target must be at least 1"],
    },

    status: {
      type: String,
      enum: ["draft", "active", "completed", "suspended"],
      default: "active",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toJSON:   { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Validate endDate is after startDate
projectSchema.pre("save", function (next) {
  if (this.endDate <= this.startDate) {
    return next(new Error("End date must be after start date"));
  }
  next();
});

module.exports = mongoose.model("Project", projectSchema);