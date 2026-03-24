const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true },
  logo:      { type: String, required: true }, // URL or filename
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Client', clientSchema);
