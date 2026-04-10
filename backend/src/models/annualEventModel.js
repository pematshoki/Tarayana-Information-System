
const mongoose = require("mongoose");

const fieldSchema = new mongoose.Schema({
  fieldName: {
    type: String,
    required: true
  },
  fieldType: {
    type: String,
    enum: ["text", "number", "date", "boolean"],
    required: true
  },
  required: {
    type: Boolean,
    default: false
  }
});

const annualEventSchema = new mongoose.Schema(
  {
    eventName: {
      type: String,
      required: true
    },
    fields: [fieldSchema] // dynamic fields
  },
  { timestamps: true }
);

module.exports = mongoose.model("AnnualEvent", annualEventSchema);