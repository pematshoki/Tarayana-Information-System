const mongoose = require("mongoose");

const beneficiarySchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  year: { type: Number, required: true },
  gender: { 
    type: String, 
    enum: { values: ['M', 'F'], message: '{VALUE} is not supported' }, 
    required: true 
  },
  cid: { 
    type: String, 
    required: true,
    validate: {
      validator: function(v) { return /^\d{11}$/.test(v); },
      message: props => `${props.value} is not a valid 11-digit CID!`
    }
  },
  name: { type: String, required: true },
  dzongkhag: { type: String, required: true, lowercase: true }, // Logic handled in controller
  gewog: { type: String, required: true, lowercase: true },
  village: { type: String, required: true, lowercase: true },
  houseNo: { type: String, required: true },
  thramNo: { type: String, required: true },
  indirectBeneficiaries: {
    male: { type: Number, default: 0 },
    female: { type: Number, default: 0 }
  },
  keyActivities: [{
    activityName: { type: String, required: true, lowercase: true },
    totalQuantity: { type: Number, required: true },
    unit: { type: String, enum: ['Acres', 'Litres', 'Nos', 'Meters'], required: true },
    specifications: [String],
    isTraining: { type: Boolean, default: false },
    trainingDetails: { date: Date, type: String }
  }]
}, { timestamps: true });

module.exports = mongoose.model("Beneficiary", beneficiarySchema);