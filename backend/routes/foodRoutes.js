const express = require('express');
const router = express.Router();
const Food = require('../models/Food');
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

// @route   POST /api/foods
// @desc    Create a new food donation
// @access  Private (Donor only)
router.post('/', protect, requireRole('donor'), async (req, res) => {
  try {
    const {
      foodName,
      quantity,
      description,
      expiryDate,
      location,
      latitude,
      longitude,
      image,
    } = req.body;

    if (!foodName || !quantity || !expiryDate || !location) {
      return res.status(400).json({
        message: 'Please provide foodName, quantity, expiryDate, and location',
      });
    }

    const food = await Food.create({
      foodName,
      quantity,
      description: description || '',
      expiryDate,
      location,
      latitude: latitude !== undefined ? Number(latitude) : 28.6139,
      longitude: longitude !== undefined ? Number(longitude) : 77.2090,
      image: image || '',
      status: 'Available',
      donor: req.user._id,
    });

    return res.status(201).json({
      message: 'Food donation created successfully',
      food,
    });
  } catch (error) {
    console.error('Create food error:', error);
    return res.status(500).json({ message: 'Server error while creating food donation', error: error.message });
  }
});

// @route   GET /api/foods/my-donations
// @desc    Get donations created by logged-in donor
// @access  Private (Donor only)
router.get('/my-donations', protect, requireRole('donor'), async (req, res) => {
  try {
    const foods = await Food.find({ donor: req.user._id }).sort({ createdAt: -1 });
    return res.json(foods);
  } catch (error) {
    console.error('Get my-donations error:', error);
    return res.status(500).json({ message: 'Server error fetching donations', error: error.message });
  }
});

// @route   GET /api/foods/:id
// @desc    Get food by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const food = await Food.findById(req.params.id).populate('donor', 'name email');
    if (!food) {
      return res.status(404).json({ message: 'Food donation not found' });
    }
    return res.json(food);
  } catch (error) {
    return res.status(500).json({ message: 'Server error fetching food item', error: error.message });
  }
});

// @route   PUT /api/foods/:id
// @desc    Update a food donation
// @access  Private (Donor only, owner only)
router.put('/:id', protect, requireRole('donor'), async (req, res) => {
  try {
    let food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({ message: 'Food donation not found' });
    }

    // Check ownership
    if (food.donor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized: You can only update your own donations' });
    }

    const {
      foodName,
      quantity,
      description,
      expiryDate,
      location,
      latitude,
      longitude,
      image,
      status,
    } = req.body;

    if (foodName !== undefined) food.foodName = foodName;
    if (quantity !== undefined) food.quantity = quantity;
    if (description !== undefined) food.description = description;
    if (expiryDate !== undefined) food.expiryDate = expiryDate;
    if (location !== undefined) food.location = location;
    if (latitude !== undefined) food.latitude = Number(latitude);
    if (longitude !== undefined) food.longitude = Number(longitude);
    if (image !== undefined) food.image = image;
    if (status !== undefined) food.status = status;

    const updatedFood = await food.save();

    return res.json({
      message: 'Food donation updated successfully',
      food: updatedFood,
    });
  } catch (error) {
    console.error('Update food error:', error);
    return res.status(500).json({ message: 'Server error updating food donation', error: error.message });
  }
});

// @route   DELETE /api/foods/:id
// @desc    Delete a food donation
// @access  Private (Donor only, owner only)
router.delete('/:id', protect, requireRole('donor'), async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({ message: 'Food donation not found' });
    }

    // Check ownership
    if (food.donor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized: You can only delete your own donations' });
    }

    await food.deleteOne();

    return res.json({ message: 'Food donation deleted successfully', id: req.params.id });
  } catch (error) {
    console.error('Delete food error:', error);
    return res.status(500).json({ message: 'Server error deleting food donation', error: error.message });
  }
});

module.exports = router;
