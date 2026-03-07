const express = require('express');
const router = express.Router();
const { createCar, getCars, getCarById, updateCar, deleteCar, searchCarsByLocation } = require('../controllers/carController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/search/location', searchCarsByLocation);
router.get('/', getCars);
router.get('/:id', getCarById);

router.post('/', protect, admin, createCar);
router.put('/:id', protect, updateCar);
router.delete('/:id', protect, admin, deleteCar);

module.exports = router;