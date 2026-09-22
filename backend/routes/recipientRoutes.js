const express = require('express');
const router = express.Router();
const Food = require('../models/Food');
const Claim = require('../models/Claim');
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

// @route   GET /api/recipient/available
// @desc    Get all available food donations
// @access  Private (Recipient)
router.get('/available', protect, requireRole('recipient'), async (req, res) => {
  try {
    const availableFoods = await Food.find({ status: 'Available' })
      .populate('donor', 'name email')
      .sort({ createdAt: -1 });

    return res.json(availableFoods);
  } catch (error) {
    console.error('Fetch available foods error:', error);
    return res.status(500).json({ message: 'Server error fetching available foods', error: error.message });
  }
});

// @route   POST /api/recipient/claim/:foodId
// @desc    Claim an available food item
// @access  Private (Recipient only)
router.post('/claim/:foodId', protect, requireRole('recipient'), async (req, res) => {
  try {
    const { foodId } = req.params;

    // Find the food item
    const food = await Food.findById(foodId);

    if (!food) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    // Check if food is still available
    if (food.status !== 'Available') {
      return res.status(400).json({ message: 'Food item has already been claimed' });
    }

    // Check if user already claimed this food
    const existingClaim = await Claim.findOne({ food: foodId, recipient: req.user._id });
    if (existingClaim) {
      return res.status(400).json({ message: 'You have already claimed this food item' });
    }

    // Update food status to Claimed
    food.status = 'Claimed';
    await food.save();

    // Create Claim document
    const claim = await Claim.create({
      food: foodId,
      recipient: req.user._id,
      status: 'Claimed',
      claimedAt: new Date(),
    });

    const populatedClaim = await Claim.findById(claim._id).populate({
      path: 'food',
      populate: { path: 'donor', select: 'name email' },
    });

    return res.status(201).json({
      message: 'Food claimed successfully!',
      claim: populatedClaim,
    });
  } catch (error) {
    console.error('Claim food error:', error);
    return res.status(500).json({ message: 'Server error claiming food', error: error.message });
  }
});

// @route   GET /api/recipient/my-claims
// @desc    Get all foods claimed by logged-in recipient
// @access  Private (Recipient only)
router.get('/my-claims', protect, requireRole('recipient'), async (req, res) => {
  try {
    const claims = await Claim.find({ recipient: req.user._id })
      .populate({
        path: 'food',
        populate: { path: 'donor', select: 'name email' },
      })
      .sort({ claimedAt: -1 });

    return res.json(claims);
  } catch (error) {
    console.error('Fetch my-claims error:', error);
    return res.status(500).json({ message: 'Server error fetching claimed food', error: error.message });
  }
});

module.exports = router;
