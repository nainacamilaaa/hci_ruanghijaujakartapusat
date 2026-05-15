const express = require('express');
const router = express.Router();
const Park = require('../models/Park');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const { deleteFromCloudinary } = require('../services/cloudinaryService');

// GET /api/parks
router.get('/', async (req, res) => {
  try {
    const parks = await Park.find().sort({ createdAt: -1 });
    res.json({ data: parks });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/parks/category/:category
router.get('/category/:category', async (req, res) => {
  try {
    const parks = await Park.find({ category: req.params.category });
    res.json({ data: parks });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/parks/:id
router.get('/:id', async (req, res) => {
  try {
    const park = await Park.findById(req.params.id);
    if (!park) return res.status(404).json({ message: 'Park not found' });
    res.json({ data: park });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/parks
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, category, bio, location, image } = req.body;
    if (!name || !category) return res.status(400).json({ message: 'Nama dan kategori wajib diisi.' });
    const park = await Park.create({ name, category, bio, location, image });
    res.status(201).json({ success: true, data: park });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/parks/:id
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, category, bio, location, image } = req.body;
    if (!name || !category) return res.status(400).json({ message: 'Nama dan kategori wajib diisi.' });
    const park = await Park.findByIdAndUpdate(
      req.params.id,
      { name, category, bio, location, image },
      { new: true, runValidators: true }
    );
    if (!park) return res.status(404).json({ message: 'Park not found' });
    res.json({ success: true, data: park });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/parks/:id
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const park = await Park.findByIdAndDelete(req.params.id);
    if (!park) return res.status(404).json({ message: 'Park not found' });

    // Hapus gambar dari Cloudinary jika ada publicId tersimpan
    if (park.imagePublicId) {
      await deleteFromCloudinary(park.imagePublicId);
    }

    res.json({ success: true, message: 'Taman berhasil dihapus.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;