const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  email:       { type: String, required: true, lowercase: true, trim: true },
  phone:       { type: String, trim: true },
  projectType: { type: String },
  message:     { type: String, required: true },
  createdAt:   { type: Date, default: Date.now }
});

module.exports = mongoose.model('Contact', contactSchema);
