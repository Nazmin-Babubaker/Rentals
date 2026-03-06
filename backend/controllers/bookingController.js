const Booking = require('../models/Booking');
const Car = require('../models/Car');

// Create a new booking
exports.createBooking = async (req, res) => {
  try {
    const { carId, startDate, endDate } = req.body;

    const car = await Car.findById(carId);
    if (!car) return res.status(404).json({ message: "Car not found" });
    if (!car.isAvailable) return res.status(400).json({ message: "Car is not available" });

    const existingBooking = await Booking.findOne({
      car: carId,
      status: { $nin: ['Cancelled'] },
      $or: [{ startDate: { $lte: endDate }, endDate: { $gte: startDate } }]
    });

    if (existingBooking) {
      return res.status(400).json({ message: "Car is already booked for these dates" });
    }

    const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
    if (days < 1) return res.status(400).json({ message: "Invalid date range" });

    const totalPrice = days * car.pricePerDay;

    const booking = await Booking.create({
      car: carId,
      user: req.user.id,
      startDate,
      endDate,
      totalPrice
    });

    await booking.populate('car');
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get current user's bookings
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('car')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cancel a booking (user can only cancel their own)
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Not authorized to cancel this booking" });
    }

    if (booking.status === 'Cancelled') {
      return res.status(400).json({ message: "Booking is already cancelled" });
    }

    if (booking.status === 'Completed') {
      return res.status(400).json({ message: "Cannot cancel a completed booking" });
    }

    booking.status = 'Cancelled';
    await booking.save();
    res.json({ message: "Booking cancelled successfully", booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin: get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate('car')
      .populate('user', 'name email phoneNumber')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin: update booking status
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (status) booking.status = status;
    if (paymentStatus) booking.paymentStatus = paymentStatus;

    await booking.save();
    await booking.populate('car');
    await booking.populate('user', 'name email');
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};