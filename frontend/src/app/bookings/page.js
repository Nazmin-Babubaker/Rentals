'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const STATUS_STYLES = {
  Pending:   'bg-yellow-100 text-yellow-800',
  Confirmed: 'bg-blue-100 text-blue-800',
  Cancelled: 'bg-red-100 text-red-700',
  Completed: 'bg-green-100 text-green-700',
};

const PAYMENT_STYLES = {
  Unpaid: 'bg-red-50 text-red-600',
  Paid:   'bg-green-50 text-green-700',
};

export default function MyBookingsPage() {
  const { token } = useAuth();
  const [bookings,     setBookings]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState('');
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const res = await fetch(`${API}/api/bookings/my-bookings`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to load bookings');
        setBookings(await res.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  const handleCancel = async (bookingId) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    setCancellingId(bookingId);
    try {
      const res = await fetch(`${API}/api/bookings/${bookingId}/cancel`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) return alert(data.message || 'Cancellation failed');
      setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, status: 'Cancelled' } : b));
    } catch {
      alert('Network error. Please try again.');
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-black font-sans pt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        <div className="mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Account</p>
          <h1 className="text-5xl font-black uppercase tracking-tighter">My Bookings</h1>
          <div className="w-16 h-1 bg-black mt-4" />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 mb-8 text-sm">{error}</div>
        )}

        {bookings.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-gray-300">
            <p className="text-gray-400 text-lg font-light mb-6">No bookings yet.</p>
            <Link href="/cars" className="text-xs font-bold uppercase tracking-widest text-white bg-black px-8 py-4 hover:bg-gray-800 transition-colors">
              Browse Fleet
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map(booking => (
              <BookingCard
                key={booking._id}
                booking={booking}
                onCancel={() => handleCancel(booking._id)}
                cancelling={cancellingId === booking._id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function BookingCard({ booking, onCancel, cancelling }) {
  const canCancel = booking.status !== 'Cancelled' && booking.status !== 'Completed';
  const nights = Math.max(1, Math.ceil(
    (new Date(booking.endDate) - new Date(booking.startDate)) / (1000 * 60 * 60 * 24)
  ));

  return (
    <div className="border border-gray-200 hover:border-black transition-colors duration-200">
      <div className="grid grid-cols-1 md:grid-cols-[140px_1fr_auto] gap-0">

        {/* Car image */}
        <div className="h-36 md:h-auto bg-gray-100 overflow-hidden">
          {booking.car?.images?.[0]
            ? <img src={booking.car.images[0]} alt={booking.car.model} className="w-full h-full object-cover" />
            : <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs uppercase tracking-widest">No Image</div>
          }
        </div>

        {/* Details */}
        <div className="p-6">
          <div className="flex flex-wrap gap-2 mb-3">
            <span className={`text-xs font-bold uppercase tracking-widest px-2 py-1 rounded-sm ${STATUS_STYLES[booking.status] || 'bg-gray-100'}`}>
              {booking.status}
            </span>
            <span className={`text-xs font-bold uppercase tracking-widest px-2 py-1 rounded-sm `}>
              {booking.paymentStatus}
            </span>
          </div>

          <h3 className="text-xl font-black uppercase tracking-tight mb-1">
            {booking.car?.brand} {booking.car?.model} {booking.car?.year}
          </h3>
          <p className="text-sm text-gray-500 mb-3">{booking.car?.location}</p>

          <div className="grid grid-cols-3 gap-4 text-xs">
            <div>
              <p className="font-bold uppercase tracking-widest text-gray-400 mb-0.5">From</p>
              <p className="font-semibold">{new Date(booking.startDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="font-bold uppercase tracking-widest text-gray-400 mb-0.5">To</p>
              <p className="font-semibold">{new Date(booking.endDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="font-bold uppercase tracking-widest text-gray-400 mb-0.5">Duration</p>
              <p className="font-semibold">{nights} day{nights !== 1 ? 's' : ''}</p>
            </div>
          </div>

          {booking.paymentReference && (
            <p className="mt-3 text-xs text-gray-400">
              Ref: <span className="font-mono font-bold text-gray-600">{booking.paymentReference}</span>
            </p>
          )}
        </div>

        {/* Price + Actions */}
        <div className="p-6 border-t md:border-t-0 md:border-l border-gray-100 flex flex-col justify-between items-end gap-4 min-w-[160px]">
          <div className="text-right">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Total</p>
            <p className="text-2xl font-black">${booking.totalPrice?.toFixed(2)}</p>
          </div>

          {canCancel && (
            <button
              onClick={onCancel}
              disabled={cancelling}
              className="w-full border border-gray-300 text-xs font-bold uppercase tracking-widest py-3 hover:border-red-400 hover:text-red-600 transition-colors disabled:opacity-50"
            >
              {cancelling ? 'Cancelling…' : 'Cancel'}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}