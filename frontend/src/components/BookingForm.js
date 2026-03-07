"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import PaymentModal from '@/components/PaymentModal';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function BookingForm({ car }) {
  const { user, token } = useAuth();
  const router = useRouter();

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate]     = useState('');
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime]     = useState('10:00');
  const [driverAgeConfirmed, setDriverAgeConfirmed] = useState(false);

  const [status, setStatus]         = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Holds the created booking — triggers PaymentModal when set
  const [createdBooking, setCreatedBooking] = useState(null);

  const today = new Date().toISOString().split('T')[0];

  // ── Price calc ──────────────────────────────────────────────────────────────
  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(`${startDate}T${startTime}`);
    const end   = new Date(`${endDate}T${endTime}`);
    const diff  = end - start;
    return diff <= 0 ? 0 : Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const days           = calculateDays();
  const carHireCharge  = days * (car?.pricePerDay || 0);
  const protectionPlan = days > 0 ? 45.00 : 0;
  const taxesAndFees   = days > 0 ? 32.50 : 0;
  const displayTotal   = carHireCharge + protectionPlan + taxesAndFees;

  // ── Create booking ──────────────────────────────────────────────────────────
  const handleBooking = async (e) => {
    e.preventDefault();

    if (!user) return router.push('/login');

    if (!driverAgeConfirmed)
      return setStatus({ type: 'error', message: 'Please confirm the driver age requirement.' });

    if (days < 1)
      return setStatus({ type: 'error', message: 'Please select a valid date range.' });

    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      const fullStartDate = new Date(`${startDate}T${startTime}`).toISOString();
      const fullEndDate   = new Date(`${endDate}T${endTime}`).toISOString();

      console.group('[BookingForm] Creating booking');
      console.log('carId:', car?._id);
      console.log('startDate:', fullStartDate);
      console.log('endDate:', fullEndDate);
      console.log('token present:', !!token);
      console.groupEnd();

      const res = await fetch(`${API}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          carId:     car._id,
          startDate: fullStartDate,
          endDate:   fullEndDate,
        }),
      });

      const data = await res.json();

      console.log('[BookingForm] Response status:', res.status);
      console.log('[BookingForm] Response data:', data);
      console.log('[BookingForm] data._id:', data?._id);

      if (!res.ok)
        return setStatus({ type: 'error', message: data.message || 'Failed to reserve vehicle.' });

      // Booking created — pass to PaymentModal
      // Backend populates car on createBooking, but if it comes back as just an ID,
      // fall back to the car prop we already have
      const bookingForModal = {
        ...data,
        _id: data._id,
        car: data.car && typeof data.car === 'object' ? data.car : car,
      };

      console.log('[BookingForm] Passing to PaymentModal:', {
        _id: bookingForModal._id,
        totalPrice: bookingForModal.totalPrice,
        carBrand: bookingForModal.car?.brand,
      });

      setCreatedBooking(bookingForModal);

    } catch (err) {
      console.error('[BookingForm] ERROR:', err);
      setStatus({ type: 'error', message: 'An error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Payment confirmed → go to profile to see the confirmed booking
  const handlePaymentSuccess = (updatedBooking) => {
    console.log('[BookingForm] Payment success, redirecting to profile');
    router.push('/profile');
  };

  // User dismissed modal without paying → still go to profile (can pay later)
  const handlePaymentSkip = () => {
    router.push('/profile');
  };

  const inputCls = "w-full px-4 py-2 bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm";
  const readOnlyCls = "w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded text-gray-500 text-sm cursor-not-allowed";

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-8 items-start">

        {/* ── Left: Forms ── */}
        <div className="flex-1 space-y-6 w-full">

          {status.message && (
            <div className={`p-4 text-sm font-medium text-center border ${
              status.type === 'error'
                ? 'bg-red-50 border-red-200 text-red-600'
                : 'bg-green-50 border-green-200 text-green-600'
            }`}>
              {status.message}
            </div>
          )}

          <form id="booking-form" onSubmit={handleBooking} className="space-y-6">

            {/* Rental Dates */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h3 className="flex items-center text-lg font-bold text-gray-900 mb-6">
                <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Rental Dates
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Pick-Up */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">Pick-Up</h4>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Date</label>
                    <input type="date" required min={today} value={startDate}
                      onChange={e => { setStartDate(e.target.value); if (endDate && e.target.value > endDate) setEndDate(''); }}
                      className={inputCls} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Time</label>
                    <input type="time" required value={startTime} onChange={e => setStartTime(e.target.value)} className={inputCls} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Location</label>
                    <input type="text" readOnly value={car?.location || ''} className={readOnlyCls} />
                  </div>
                </div>

                {/* Return */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">Return</h4>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Date</label>
                    <input type="date" required min={startDate || today} value={endDate}
                      onChange={e => setEndDate(e.target.value)} className={inputCls} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Time</label>
                    <input type="time" required value={endTime} onChange={e => setEndTime(e.target.value)} className={inputCls} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Location</label>
                    <input type="text" readOnly value="Same as pick-up" className={readOnlyCls} />
                  </div>
                </div>
              </div>
            </div>

            {/* Driver Details */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h3 className="flex items-center text-lg font-bold text-gray-900 mb-6">
                <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Driver Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">First Name</label>
                  <input type="text" defaultValue={user?.name?.split(' ')[0] || ''} className={inputCls} />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Last Name</label>
                  <input type="text" defaultValue={user?.name?.split(' ').slice(1).join(' ') || ''} className={inputCls} />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Email Address</label>
                  <input type="email" defaultValue={user?.email || ''} readOnly className={readOnlyCls} />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Phone Number</label>
                  <input type="tel" className={inputCls} />
                </div>
              </div>

              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={driverAgeConfirmed}
                  onChange={e => setDriverAgeConfirmed(e.target.checked)}
                  className="w-4 h-4 mt-0.5 text-slate-900 border-gray-300 rounded focus:ring-slate-900"
                />
                <span className="text-sm text-gray-600">
                  I confirm the driver is over 25 years old and holds a valid driving licence.
                </span>
              </label>
            </div>

          </form>
        </div>

        {/* ── Right: Summary ── */}
        <div className="w-full lg:w-[400px] flex-shrink-0">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Booking Summary</h2>

            <div className="w-full h-40 bg-gray-100 rounded-lg mb-6 relative overflow-hidden">
              <div
                className="absolute inset-0 bg-contain bg-center bg-no-repeat m-4 mix-blend-multiply opacity-80"
                style={{ backgroundImage: `url(${car?.images?.[0] || 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=800'})` }}
              />
            </div>

            <div className="flex justify-between items-start mb-1">
              <h3 className="text-lg font-bold text-gray-900">{car?.brand} {car?.model}</h3>
              <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                {car?.fuelType}
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-4">{car?.year} · {car?.transmission} · {car?.seats} seats</p>

            <div className="flex items-center space-x-4 mb-6 text-xs text-gray-600">
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                {car?.seats} Seats
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                {car?.fuelType}
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                {car?.transmission?.startsWith('A') ? 'Auto' : 'Manual'}
              </span>
            </div>

            <div className="border-t border-gray-100 my-4" />

            <div className="space-y-3 mb-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Car hire ({days} day{days !== 1 ? 's' : ''} × ${car?.pricePerDay})</span>
                <span className="font-medium">${carHireCharge.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Protection plan</span>
                <span className="font-medium">${protectionPlan.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Taxes & Fees</span>
                <span className="font-medium">${taxesAndFees.toFixed(2)}</span>
              </div>
            </div>

            <div className="border-t border-gray-100 my-4" />

            <div className="flex justify-between items-center mb-6">
              <span className="text-base font-bold">Total</span>
              <span className="text-2xl font-bold">${displayTotal.toFixed(2)}</span>
            </div>

            <button
              type="submit"
              form="booking-form"
              disabled={isSubmitting || days < 1 || !driverAgeConfirmed}
              className="w-full py-3.5 bg-[#1e2329] text-white text-sm font-semibold rounded hover:bg-black transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {isSubmitting
                ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Confirming…</>
                : user ? 'Confirm Booking →' : 'Log in to Reserve'
              }
            </button>

            <p className="text-center text-[10px] text-gray-400 mt-4">
              Free cancellation up to 48 hours before pick-up.
            </p>
          </div>
        </div>

      </div>

      {/* PaymentModal — opens automatically after booking row is created */}
      {createdBooking && (
        <PaymentModal
          booking={createdBooking}
          onClose={handlePaymentSkip}
          onPaid={handlePaymentSuccess}
        />
      )}
    </>
  );
}