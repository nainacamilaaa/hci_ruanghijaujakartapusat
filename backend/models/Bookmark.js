const mongoose = require('mongoose');
const bookmarkSchema = new mongoose.Schema({
  sessionId: { type: String, required: true },
  parkId: { type: String, required: true },
}, { timestamps: true });
module.exports = mongoose.model('Bookmark', bookmarkSchema);
