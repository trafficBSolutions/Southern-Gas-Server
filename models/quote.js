const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
  name:    { type: String, required: true },
  email: {
  type: String,
  required: true
},
  phone:   { type: String },
  service: { type: String, required: true },
  details: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Quote', quoteSchema);
