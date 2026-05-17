const express = require('express');
const router = express.Router();
const Bookmark = require('../models/Bookmark');
const { authMiddleware } = require('../middleware/auth');

// GET /api/bookmarks — ambil semua bookmark user yang login
router.get('/', authMiddleware, async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ userId: req.user.id });
    res.json({ data: bookmarks.map(b => b.parkId) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/bookmarks — tambah bookmark
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { parkId } = req.body;
    if (!parkId) return res.status(400).json({ message: 'parkId required' });
    const existing = await Bookmark.findOne({ userId: req.user.id, parkId });
    if (existing) return res.json({ data: parkId });
    await Bookmark.create({ userId: req.user.id, parkId });
    res.status(201).json({ data: parkId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/bookmarks/:parkId — hapus bookmark
router.delete('/:parkId', authMiddleware, async (req, res) => {
  try {
    await Bookmark.findOneAndDelete({ userId: req.user.id, parkId: req.params.parkId });
    res.json({ message: 'Bookmark removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;