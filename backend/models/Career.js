const mongoose = require('mongoose');

const careerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  department: { type: String, default: 'Engineering' },
  location: { type: String, default: 'Chennai, TN' },
  type: { type: String, default: 'Full-time' },
  description: { type: String },
  active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Career', careerSchema);
