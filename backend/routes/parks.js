const express = require('express');
const router = express.Router();
const Park = require('../models/Park');

router.get('/', async (req, res) => {
  try {
    const parks = await Park.find();
    res.json({ data: parks });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const park = await Park.findById(req.params.id);
    if (!park) return res.status(404).json({ message: 'Park not found' });
    res.json({ data: park });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/category/:category', async (req, res) => {
  try {
    const parks = await Park.find({ category: req.params.category });
    res.json({ data: parks });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
