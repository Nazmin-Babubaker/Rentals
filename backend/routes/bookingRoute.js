const express = require('express');
const router = express.Router();
const {
  createBooking,
  getUserBookings,
  cancelBooking,
  getAllBookings,
  updateBookingStatus
} = require('../controllers/bookingController');
const { protect, admin } = require('../middleware/authMiddleware');

// User routes
router.post('/', protect, createBooking);
router.get('/my-bookings', protect, getUserBookings);
router.put('/:id/cancel', protect, cancelBooking);

// Admin routes
router.get('/', protect, admin, getAllBookings);
router.put('/:id/status', protect, admin, updateBookingStatus);

module.exports = router;