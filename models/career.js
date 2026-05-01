const mongoose = require('mongoose');

const careerSchema = new mongoose.Schema({
  name:       { type: String, required: true },
  email: {
  type: String,
  required: true,
  trim: true,
  lowercase: true,
  match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
},
  phone:      { type: String },
  position:   { type: String, required: true },
  experience: { type: String },
  resume:     { type: String },
  coverLetter:{ type: String },
  message:    { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Career', careerSchema);
