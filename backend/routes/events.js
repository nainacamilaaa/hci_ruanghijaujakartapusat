const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const { deleteFromCloudinary } = require('../services/cloudinaryService');

// GET /api/events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json({ data: events });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/events/sort/newest
router.get('/sort/newest', async (req, res) => {
  try {
    const events = await Event.find().sort({ date: -1 });
    res.json({ data: events });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/events/sort/oldest
router.get('/sort/oldest', async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json({ data: events });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/events/:id
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json({ data: event });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/events
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { title, description, location, date, image, parkId } = req.body;
    if (!title) return res.status(400).json({ message: 'Judul acara wajib diisi.' });
    const event = await Event.create({ title, description, location, date, image, parkId });
    res.status(201).json({ success: true, data: event });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/events/:id
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { title, description, location, date, image, parkId } = req.body;
    if (!title) return res.status(400).json({ message: 'Judul acara wajib diisi.' });
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { title, description, location, date: date || null, image, parkId: parkId || null },
      { new: true, runValidators: true }
    );
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json({ success: true, data: event });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/events/:id
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (event.imagePublicId) {
      await deleteFromCloudinary(event.imagePublicId);
    }

    res.json({ success: true, message: 'Acara berhasil dihapus.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;