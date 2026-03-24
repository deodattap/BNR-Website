const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  description: { type: String },
  image:       { type: String }, // URL or filename
  location:    { type: String },
  year:        { type: String },
  category:    { type: String },
  createdAt:   { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', projectSchema);
