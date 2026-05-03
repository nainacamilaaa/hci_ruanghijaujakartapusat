const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

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

module.exports = router;
