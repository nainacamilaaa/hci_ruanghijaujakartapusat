const mongoose = require('mongoose');
const parkSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  bio: { type: String },
  location: { type: String },
  image: { type: String },
}, { timestamps: true });
module.exports = mongoose.model('Park', parkSchema);
