"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function BookingForm({ carId, pricePerDay }) {
  const { user, token } = useAuth();
  const router = useRouter();

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper to get local datetime string for the min attribute
  const getLocalMinDateTime = () => {
    const tzoffset = new Date().getTimezoneOffset() * 60000;
    return new Date(Date.now() - tzoffset).toISOString().slice(0, 16);
  };

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    if (diffTime < 0) return 0;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 0 ? 1 : diffDays;
  };

  const days = calculateDays();
  const totalPrice = days * pricePerDay;

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) {
      router.push('/login');
      return;
    }
    
    if (days < 1) {
      return setStatus({ type: 'error', message: 'Invalid date range.' });
    }

    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      const res = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ carId, startDate, endDate })
      });

      const data = await res.json();
      
      if (res.ok) {
        setStatus({ type: 'success', message: 'Vehicle Reserved Successfully!' });
        setTimeout(() => router.push('/profile'), 2000);
      } else {
        setStatus({ type: 'error', message: data.message || 'Failed to reserve vehicle.' });
      }
    } catch (error) {
      console.error(error);
      setStatus({ type: 'error', message: 'An error occurred during booking.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 border border-gray-200 p-8 mt-12">
      <h3 className="text-sm font-bold tracking-widest uppercase text-gray-400 mb-6">Reservation Details</h3>
      
      {status.message && (
        <div className={`mb-6 p-4 text-sm font-bold text-center border ${status.type === 'error' ? 'bg-red-50 border-red-200 text-red-600' : 'bg-green-50 border-green-200 text-green-600'}`}>
          {status.message}
        </div>
      )}

      <form onSubmit={handleBooking} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Pick-up Date & Time</label>
            <input 
              type="datetime-local" 
              required 
              min={getLocalMinDateTime()}
              value={startDate} 
              onChange={e => setStartDate(e.target.value)} 
              className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors" 
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Return Date & Time</label>
            <input 
              type="datetime-local" 
              required 
              min={startDate || getLocalMinDateTime()}
              value={endDate} 
              onChange={e => setEndDate(e.target.value)} 
              className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors" 
            />
          </div>
        </div>

        {days > 0 && (
          <div className="pt-6 border-t border-gray-200 flex justify-between items-center text-xl font-black uppercase tracking-tighter">
            <span>Estimated Total ({days} Days)</span>
            <span>${totalPrice}</span>
          </div>
        )}

        <button 
          type="submit" 
          disabled={isSubmitting || days < 1}
          className="w-full text-sm font-bold tracking-widest uppercase text-white bg-black py-5 hover:bg-gray-800 transition-colors duration-300 disabled:opacity-50"
        >
          {isSubmitting ? 'Processing...' : user ? 'Reserve Vehicle' : 'Log in to Reserve'}
        </button>
      </form>
    </div>
  );
}
