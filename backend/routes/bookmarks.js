const express = require('express');
const router = express.Router();
const Bookmark = require('../models/Bookmark');

router.get('/:sessionId', async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ sessionId: req.params.sessionId });
    res.json({ data: bookmarks });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { sessionId, parkId } = req.body;
    const existing = await Bookmark.findOne({ sessionId, parkId });
    if (existing) return res.json({ data: existing });
    const bookmark = new Bookmark({ sessionId, parkId });
    await bookmark.save();
    res.status(201).json({ data: bookmark });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:sessionId/:parkId', async (req, res) => {
  try {
    await Bookmark.findOneAndDelete({ sessionId: req.params.sessionId, parkId: req.params.parkId });
    res.json({ message: 'Bookmark removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
