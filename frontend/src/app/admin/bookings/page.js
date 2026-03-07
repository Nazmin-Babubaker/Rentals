"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useAuth();

  const fetchBookings = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/bookings', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      } else {
        setError('Failed to fetch bookings');
      }
    } catch (err) {
      console.error(err);
      setError('Error connecting to backend');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchBookings();
  }, [token]);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) fetchBookings();
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-6xl">
      <h1 className="text-3xl font-black uppercase tracking-tighter mb-8">Manage Bookings</h1>
      
      <div className="bg-white border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500">Booking ID</th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500">Vehicle</th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500">Dates</th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500">Status</th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="p-4 font-mono text-xs">{b._id.slice(-6)}</td>
                <td className="p-4 font-medium">{b.car ? `${b.car.brand} ${b.car.model}` : 'Unknown Vehicle'}</td>
                <td className="p-4 text-sm text-gray-600">
                  <div className="whitespace-nowrap">{new Date(b.startDate).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' })}</div>
                  <div className="text-gray-400 text-xs text-center border-t border-gray-200 mt-1 pt-1">to</div>
                  <div className="whitespace-nowrap">{new Date(b.endDate).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' })}</div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs font-bold uppercase tracking-wider 
                    ${b.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                      b.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 
                      b.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'}`}>
                    {b.status}
                  </span>
                </td>
                <td className="p-4 text-right space-x-4">
                  {b.status === 'Pending' && (
                    <button onClick={() => handleStatusUpdate(b._id, 'Confirmed')} className="text-xs font-bold uppercase tracking-widest text-blue-600 hover:underline">
                      Approve
                    </button>
                  )}
                  {b.status === 'Confirmed' && (
                    <button onClick={() => handleStatusUpdate(b._id, 'Completed')} className="text-xs font-bold uppercase tracking-widest text-green-600 hover:underline">
                      Complete
                    </button>
                  )}
                  {b.status !== 'Cancelled' && b.status !== 'Completed' && (
                    <button onClick={() => handleStatusUpdate(b._id, 'Cancelled')} className="text-xs font-bold uppercase tracking-widest text-red-600 hover:underline">
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr><td colSpan="5" className="p-8 text-center text-gray-500">No bookings exist.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
