const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name:    { type: String, required: true },
  email: {
  type: String,
  required: true,
  trim: true,
  lowercase: true,
  match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
},
  phone:   { type: String },
  service: { type: String },
  message: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);
