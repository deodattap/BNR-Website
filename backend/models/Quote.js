const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  company:     { type: String, trim: true },
  email:       { type: String, required: true, lowercase: true, trim: true },
  phone:       { type: String, required: true, trim: true },
  projectType: { type: String, required: true },
  location:    { type: String, required: true },
  budget:      { type: String, required: true },
  description: { type: String },
  createdAt:   { type: Date, default: Date.now }
});

module.exports = mongoose.model('Quote', quoteSchema);
