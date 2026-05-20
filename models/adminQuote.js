const mongoose = require('mongoose');
const crypto = require('crypto');

const lineItemSchema = new mongoose.Schema({
  item:        { type: String },
  description: { type: String },
  unit:        { type: String },
  jobType:     { type: String },
  taxable:     { type: Boolean, default: true },
  qty:         { type: Number, default: 1 },
  unitPrice:   { type: Number, default: 0 },
  notes:       { type: String },
}, { _id: false });

const adminQuoteSchema = new mongoose.Schema({
  quoteNumber: { type: String },
  customer:    { type: String, required: true },
  email:       { type: String, required: true },
  phone:       { type: String },
  jobAddress:  { type: String },
  county:      { type: String },
  area:        { type: String, default: 'North GA / Local' },
  service:     { type: String },
  jobType:     { type: String },
  profitMargin:{ type: String, default: '40%' },
  rows:        [lineItemSchema],
  taxRate:     { type: Number, default: 0.08 },
  isTaxExempt: { type: Boolean, default: false },
  subtotal:    { type: Number, default: 0 },
  discount:    { type: Number, default: 0 },
  permitFee:   { type: Number, default: 0 },
  taxDue:      { type: Number, default: 0 },
  total:       { type: Number, default: 0 },
  status:      { type: String, enum: ['pending', 'approved', 'declined'], default: 'pending' },
  approvalToken: { type: String, default: () => crypto.randomBytes(32).toString('hex') },
  pdfPath:     { type: String },
}, { timestamps: true });

module.exports = mongoose.model('AdminQuote', adminQuoteSchema);
