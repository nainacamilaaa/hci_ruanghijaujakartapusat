const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// GET /api/reviews/park/:parkId
router.get('/park/:parkId', async (req, res) => {
  try {
    const reviews = await Review.find({ parkId: req.params.parkId }).sort({ createdAt: -1 });
    res.json({ data: reviews });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/reviews/stats/:parkId
router.get('/stats/:parkId', async (req, res) => {
  try {
    const reviews = await Review.find({ parkId: req.params.parkId }).sort({ createdAt: -1 });
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;
    res.json({ data: reviews, totalReviews, averageRating });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/reviews — user login bisa review
router.post('/', authMiddleware, async (req, res) => {
  try {
    console.log('Body:', req.body);
    console.log('User:', req.user);
    const { parkId, name, rating, comment } = req.body;
    if (!parkId || !rating) return res.status(400).json({ message: 'parkId dan rating wajib diisi.' });
    const review = await Review.create({ parkId, name, rating, comment });
    res.status(201).json({ data: review });
  } catch (err) {
    console.error('Review create error:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/reviews/:id — hanya admin
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;