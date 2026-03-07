'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/**
 * PaymentModal
 *
 * Props:
 *   booking  – booking object (_id, totalPrice, car, startDate, endDate)
 *   onClose  – called when modal is dismissed (without paying)
 *   onPaid   – called with the updated booking after payment is confirmed
 */
export default function PaymentModal({ booking, onClose, onPaid }) {
  const { token } = useAuth();

  const [step, setStep]             = useState('details'); // details | processing | success | failed
  const [cardName, setCardName]     = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry]         = useState('');
  const [cvv, setCvv]               = useState('');
  const [validationError, setValidationError] = useState('');
  const [failReason, setFailReason] = useState('');
  const [paymentRef, setPaymentRef] = useState('');

  // ── Formatters ──────────────────────────────────────────────────────────────
  const formatCard = (v) =>
    v.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');

  const formatExpiry = (v) => {
    const d = v.replace(/\D/g, '').slice(0, 4);
    return d.length > 2 ? d.slice(0, 2) + '/' + d.slice(2) : d;
  };

  // ── Confirm Payment ──────────────────────────────────────────────────────────
  const handleConfirmPayment = async () => {
    setValidationError('');

    // Client-side card validation
    if (cardName.trim().length < 2)      return setValidationError('Enter the cardholder name.');
    if (cardNumber.replace(/\s/g,'').length < 16) return setValidationError('Enter a valid 16-digit card number.');
    if (expiry.length < 5)               return setValidationError('Enter expiry as MM/YY.');
    if (cvv.length < 3)                  return setValidationError('Enter a valid CVV.');

    const bookingId = booking?._id;

    // Debug
    console.group('[PaymentModal] Confirm Payment');
    console.log('bookingId:', bookingId);
    console.log('totalPrice:', booking?.totalPrice);
    console.log('token present:', !!token);
    console.log('endpoint:', `${API}/api/bookings/${bookingId}/pay`);
    console.groupEnd();

    if (!bookingId) {
      return setValidationError('Booking ID missing — please close and try again.');
    }

    setStep('processing');

    try {
      const res = await fetch(`${API}/api/bookings/${bookingId}/pay`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('[PaymentModal] Response status:', res.status);

      // Guard against HTML error pages (502, nginx errors etc.)
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        const raw = await res.text();
        console.error('[PaymentModal] Non-JSON response:', raw.slice(0, 300));
        setFailReason(`Server error (${res.status}) — please try again.`);
        return setStep('failed');
      }

      const data = await res.json();
      console.log('[PaymentModal] Response data:', data);

      if (!res.ok) {
        console.error('[PaymentModal] Failed:', data.message);
        setFailReason(data.message || 'Payment could not be processed.');
        return setStep('failed');
      }

      console.log('[PaymentModal] ✓ SUCCESS ref:', data.paymentReference);
      setPaymentRef(data.paymentReference || '');
      setStep('success');
      if (onPaid) onPaid(data.booking);

    } catch (err) {
      console.error('[PaymentModal] Fetch error:', err);
      setFailReason('Network error — please check your connection.');
      setStep('failed');
    }
  };

  const nights = Math.max(
    1,
    Math.ceil(
      (new Date(booking.endDate) - new Date(booking.startDate)) / (1000 * 60 * 60 * 24)
    )
  );

  const safeTotal = (booking.totalPrice ?? 0).toFixed(2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white text-black font-sans shadow-2xl">

        {/* Header */}
        <div className="bg-black text-white px-8 py-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">
              {step === 'success' ? 'Booking Confirmed' : step === 'failed' ? 'Payment Failed' : 'Secure Checkout'}
            </p>
            <p className="text-2xl font-black tracking-tighter">${safeTotal}</p>
          </div>
          {step !== 'processing' && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors text-3xl leading-none ml-8"
            >
              ×
            </button>
          )}
        </div>

        {/* Car summary strip */}
        <div className="px-8 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-4">
          <div className="w-16 h-12 bg-gray-200 overflow-hidden shrink-0">
            {booking.car?.images?.[0]
              ? <img src={booking.car.images[0]} alt="" className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center text-gray-300 text-[10px]">No img</div>
            }
          </div>
          <div>
            <p className="font-black text-sm uppercase tracking-tight">
              {booking.car?.brand} {booking.car?.model}
            </p>
            <p className="text-xs text-gray-500">
              {new Date(booking.startDate).toLocaleDateString()} →{' '}
              {new Date(booking.endDate).toLocaleDateString()}
              <span className="ml-2 text-gray-400">({nights} day{nights !== 1 ? 's' : ''})</span>
            </p>
          </div>
        </div>

        {/* ── STEP: Card Details ─────────────────────────────────────────────── */}
        {step === 'details' && (
          <div className="px-8 py-6 space-y-4">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Card Details</p>

            {validationError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-3 font-medium">
                {validationError}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Cardholder Name</label>
              <input
                type="text"
                value={cardName}
                onChange={e => setCardName(e.target.value)}
                placeholder="John Doe"
                autoComplete="cc-name"
                className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Card Number</label>
              <input
                type="text"
                inputMode="numeric"
                value={cardNumber}
                onChange={e => setCardNumber(formatCard(e.target.value))}
                placeholder="0000 0000 0000 0000"
                autoComplete="cc-number"
                className="w-full border border-gray-300 px-4 py-3 text-sm tracking-widest focus:outline-none focus:border-black transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Expiry</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={expiry}
                  onChange={e => setExpiry(formatExpiry(e.target.value))}
                  placeholder="MM/YY"
                  autoComplete="cc-exp"
                  className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">CVV</label>
                <input
                  type="password"
                  inputMode="numeric"
                  value={cvv}
                  onChange={e => setCvv(e.target.value.replace(/\D/g,'').slice(0,4))}
                  placeholder="•••"
                  autoComplete="cc-csc"
                  className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                />
              </div>
            </div>

            {/* Price summary */}
            <div className="bg-gray-50 border border-gray-100 px-4 py-3 text-xs text-gray-500 space-y-1">
              <div className="flex justify-between">
                <span>${booking.car?.pricePerDay}/day × {nights} day{nights !== 1 ? 's' : ''}</span>
                <span className="font-bold text-black">${safeTotal}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Taxes & fees</span>
                <span>Included</span>
              </div>
            </div>

            <button
              onClick={handleConfirmPayment}
              className="w-full bg-black text-white py-4 text-xs font-bold uppercase tracking-widest hover:bg-gray-900 transition-colors"
            >
              Confirm Payment — ${safeTotal}
            </button>

            <p className="text-center text-xs text-gray-400">
              🔒 Simulated payment — no real charge is made
            </p>
          </div>
        )}

        {/* ── STEP: Processing ──────────────────────────────────────────────── */}
        {step === 'processing' && (
          <div className="px-8 py-20 text-center">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-6" />
            <p className="font-black uppercase tracking-widest text-lg mb-1">Processing</p>
            <p className="text-xs text-gray-400 uppercase tracking-widest">Please don&apos;t close this window</p>
          </div>
        )}

        {/* ── STEP: Failed ──────────────────────────────────────────────────── */}
        {step === 'failed' && (
          <div className="px-8 py-12 text-center">
            <div className="w-16 h-16 bg-red-600 text-white text-3xl flex items-center justify-center mx-auto mb-6">✕</div>
            <p className="font-black uppercase tracking-widest text-xl mb-2 text-red-700">Payment Failed</p>
            <p className="text-sm text-gray-600 mb-6 max-w-xs mx-auto">{failReason}</p>

            <div className="bg-gray-50 border border-gray-200 text-left px-5 py-4 mb-8 text-xs text-gray-500 space-y-1.5">
              <p className="font-bold uppercase tracking-widest text-gray-400 mb-2">This can happen when:</p>
              <p>· The booking was already cancelled</p>
              <p>· Payment was already completed for this booking</p>
              <p>· Your session expired — try logging in again</p>
              <p>· A network issue interrupted the request</p>
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => { setFailReason(''); setValidationError(''); setStep('details'); }}
                className="bg-black text-white px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={onClose}
                className="border border-gray-300 text-gray-600 px-8 py-3 text-xs font-bold uppercase tracking-widest hover:border-black hover:text-black transition-colors"
              >
                Pay Later
              </button>
            </div>
            <p className="text-[10px] text-gray-400 mt-5">You can complete payment anytime from My Bookings.</p>
          </div>
        )}

        {/* ── STEP: Success ─────────────────────────────────────────────────── */}
        {step === 'success' && (
          <div className="px-8 py-12 text-center">
            <div className="w-16 h-16 bg-green-600 text-white text-3xl flex items-center justify-center mx-auto mb-6">✓</div>
            <p className="font-black uppercase tracking-widest text-xl mb-2">Booking Confirmed!</p>
            <p className="text-sm text-gray-500 mb-4">
              Your car is reserved and payment is complete.
            </p>

            {paymentRef && (
              <div className="inline-block bg-gray-50 border border-gray-200 px-6 py-3 mb-6">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Payment Reference</p>
                <p className="font-mono font-bold text-sm text-black">{paymentRef}</p>
              </div>
            )}

            <p className="text-xs text-gray-400 mb-8">
              Your booking status is now{' '}
              <span className="font-bold text-green-600">Confirmed</span>.
              The car has been reserved for your dates.
            </p>

            <button
              onClick={onClose}
              className="bg-black text-white px-10 py-4 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
            >
              Done
            </button>
          </div>
        )}

      </div>
    </div>
  );
}