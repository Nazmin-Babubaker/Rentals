const Booking = require('../models/Booking');
const Car = require('../models/Car');



// const generatePaymentRef = () =>
//   'PAY-' + Math.random().toString(36).substring(2, 10).toUpperCase();
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

    const diffDays = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return res.status(400).json({ message: "Invalid date range" });
    const days = diffDays === 0 ? 1 : diffDays;

    const totalPrice = days * car.pricePerDay;

    const booking = await Booking.create({
      car: carId,
      user: req.user.id,
      startDate,
      endDate,
      totalPrice,
       status:        'Pending',
      paymentStatus: 'Unpaid',
    });

    await booking.populate('car');
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



exports.confirmPayment = async (req, res) => {
  try {
    const bookingId = req.params.id;

    console.log('\n[confirmPayment] bookingId:', bookingId);
    console.log('[confirmPayment] user:', req.user?.id);

    if (!bookingId || !/^[a-fA-F0-9]{24}$/.test(bookingId))
      return res.status(400).json({ message: `Invalid booking ID: "${bookingId}"` });

    const booking = await Booking.findById(bookingId).populate('car');

    if (!booking) {
      console.error('[confirmPayment] Booking not found:', bookingId);
      return res.status(404).json({ message: 'Booking not found' });
    }

    console.log('[confirmPayment] booking.user:', booking.user.toString());
    console.log('[confirmPayment] req.user.id: ', req.user.id?.toString());

    // Ownership check
    const bookingUserId = booking.user.toString();
    const requestUserId = (req.user.id ?? req.user._id)?.toString();

    console.log('[confirmPayment] IDs match:', bookingUserId === requestUserId);

    if (bookingUserId !== requestUserId)
      return res.status(403).json({ message: 'Not authorized to pay for this booking' });

    if (booking.status === 'Cancelled')
      return res.status(400).json({ message: 'Cannot pay for a cancelled booking' });

    if (booking.paymentStatus === 'Paid')
      return res.status(400).json({ message: 'Booking is already paid and confirmed' });

    // ── Core logic: confirm payment immediately ──────────────────────────────
    booking.paymentStatus    = 'Paid';
    booking.status           = 'Confirmed';
    // booking.paymentReference = generatePaymentRef();

    // Lock the car
    if (booking.car) {
      booking.car.isAvailable = false;
      await booking.car.save();
      console.log('[confirmPayment] Car locked:', booking.car._id.toString());
    }

    await booking.save();
    await booking.populate('car'); // re-populate after save

    // console.log('[confirmPayment] SUCCESS ref:', booking.paymentReference);

    res.json({
      message:          'Payment confirmed. Booking is now active.',
      booking,
    });
  } catch (error) {
    console.error('[confirmPayment] ERROR:', error);
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
    const booking = await Booking.findById(req.params.id).populate('car');
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
    
    // Also revert car availability if the booking was confirmed or paid
    if (booking.car && !booking.car.isAvailable) {
       booking.car.isAvailable = true;
       await booking.car.save();
    }

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
    const booking = await Booking.findById(req.params.id).populate('car');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (status) {
      booking.status = status;
      if ((status === 'Completed' || status === 'Cancelled') && booking.car) {
        booking.car.isAvailable = true;
        await booking.car.save();
      }
    }

    if (paymentStatus) {
      booking.paymentStatus = paymentStatus;
      // Admin confirms payment → lock the car, confirm booking
      if (paymentStatus === 'Paid' && booking.car) {
        booking.car.isAvailable = false;
        await booking.car.save();
        // Auto-confirm booking when payment is confirmed
        if (booking.status === 'Pending') {
          booking.status = 'Confirmed';
        }
      }
    }

    await booking.save();
    await booking.populate('car');
    await booking.populate('user', 'name email');
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


