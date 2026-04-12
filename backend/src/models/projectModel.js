const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  projectName: { type: String, required: [true, "Project Name is required"] },
  dzongkhag: { 
    type: [String], 
    validate: [v => v.length > 0, "At least one Dzongkhag must be selected"] 
  },
  startDate: { type: Date, required: [true, "Start Date is required"] },
  endDate: { type: Date, required: [true, "End Date is required"] },
  donor: { 
    type: [mongoose.Schema.Types.ObjectId], 
    ref: "donorPartner", 
    validate: [v => v.length > 0, "At least one Donor must be selected"] 
  },
  partner: { 
    type: [mongoose.Schema.Types.ObjectId], 
    ref: "donorPartner", 
    validate: [v => v.length > 0, "At least one Partner must be selected"] 
  },
  programme: { type: mongoose.Schema.Types.ObjectId, ref: "Programme", required: true },
  fieldOfficer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  description: { type: String } // Not required
}, { timestamps: true });

module.exports = mongoose.model("Project", projectSchema);