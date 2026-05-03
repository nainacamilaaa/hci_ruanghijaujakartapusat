const express = require('express');
const router = express.Router();
const Review = require('../models/Review');

router.get('/park/:parkId', async (req, res) => {
  try {
    const reviews = await Review.find({ parkId: req.params.parkId });
    res.json({ data: reviews });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/stats/:parkId', async (req, res) => {
  try {
    const reviews = await Review.find({ parkId: req.params.parkId });
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews : 0;
    res.json({ data: reviews, totalReviews, averageRating });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { parkId, name, rating, comment } = req.body;
    const review = new Review({ parkId, name, rating, comment });
    await review.save();
    res.status(201).json({ data: review });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
