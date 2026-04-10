const mongoose = require("mongoose");

// Each entry links to a KeyActivity and records how much this beneficiary received
const activityEntrySchema = new mongoose.Schema(
  {
    keyActivity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "KeyActivity",
      required: true,
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [0, "Quantity cannot be negative"],
    },
    notes: { type: String, trim: true },
  },
  { _id: false }
);

const beneficiarySchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "Project is required"],
      index: true,
    },
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    gender:        { type: String, enum: ["male", "female", "other"] },
    dateOfBirth:   { type: Date },
    contactNumber: { type: String, trim: true },
    cidNumber:     { type: String, trim: true, sparse: true },

    // Plain string — from the same hardcoded DZONGKHAGS list
    dzongkhag: { type: String, trim: true },
    gewog:     { type: String, trim: true },
    village:   { type: String, trim: true },

    // Array of activity quantities for this beneficiary
    activities: [activityEntrySchema],

    assignedFieldOfficer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    notes:        { type: String, trim: true },
    registeredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
    toJSON:   { virtuals: true },
    toObject: { virtuals: true },
  }
);

beneficiarySchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model("Beneficiary", beneficiarySchema);