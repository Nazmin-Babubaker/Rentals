const express = require('express');
const router = express.Router();
const {
  createBooking,
  getUserBookings,
  cancelBooking,
  getAllBookings,
  updateBookingStatus,
  confirmPayment
} = require('../controllers/bookingController');
const { protect, admin } = require('../middleware/authMiddleware');

// User routes
router.post('/', protect, createBooking);
router.get('/my-bookings', protect, getUserBookings);
router.put('/:id/cancel', protect, cancelBooking);

// Admin routes
router.get('/all', protect, admin, getAllBookings);
// router.put('/:id/pay', protect, simulatePayment);
router.put('/:id/pay',        protect,        confirmPayment);

router.put('/:id/status', protect, admin, updateBookingStatus);



module.exports = router;