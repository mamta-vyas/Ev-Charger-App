const express = require('express');
const Charger = require('../models/Charger');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

// Create a Charger
router.post('/', protect, async (req, res) => {
  try {
    const { name, location, status, powerOutput, connectorType } = req.body;
    const newCharger = await Charger.create({
      name,
      location,
      status,
      powerOutput,
      connectorType,
      createdBy: req.user._id,
    });
    res.status(201).json(newCharger);
  } catch (err) {
    res.status(400).json({ message: 'Error creating charger', error: err.message });
  }
});

// Get All Chargers
router.get('/', async (req, res) => {
  try {
    const chargers = await Charger.find();
    res.json(chargers);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching chargers' });
  }
});

// Update Charger
router.put('/:id', protect, async (req, res) => {
  try {
    const updatedCharger = await Charger.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedCharger);
  } catch (err) {
    res.status(400).json({ message: 'Error updating charger' });
  }
});

// Delete Charger
router.delete('/:id', protect, async (req, res) => {
  try {
    await Charger.findByIdAndDelete(req.params.id);
    res.json({ message: 'Charger deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Error deleting charger' });
  }
});

module.exports = router;
