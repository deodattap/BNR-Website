const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  jobTitle:           { type: String, required: true, trim: true },
  jobId:              { type: mongoose.Schema.Types.ObjectId, ref: 'Career', default: null },
  name:               { type: String, required: true, trim: true },
  email:              { type: String, required: true, trim: true },
  phone:              { type: String, trim: true },
  resumeUrl:          { type: String },          // relative path e.g. /uploads/resume-xxx.pdf
  resumeOriginalName: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);
