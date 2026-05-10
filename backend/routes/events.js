const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const events = await Event.find();
    res.json({ data: events });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/sort/newest', async (req, res) => {
  try {
    const events = await Event.find().sort({ date: -1 });
    res.json({ data: events });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/sort/oldest', async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json({ data: events });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json({ data: event });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

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

module.exports = router;