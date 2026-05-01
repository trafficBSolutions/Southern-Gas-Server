const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  quote:       { type: mongoose.Schema.Types.ObjectId, ref: 'AdminQuote' },
  customer:    { type: String, required: true },
  email:       { type: String, required: true },
  phone:       { type: String },
  service:     { type: String },
  total:       { type: Number },
  dates:       [{ type: String }],
  address:     { type: String, required: true },
  notes:       { type: String },
  status:      { type: String, enum: ['scheduled', 'in-progress', 'completed', 'cancelled'], default: 'scheduled' },
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
