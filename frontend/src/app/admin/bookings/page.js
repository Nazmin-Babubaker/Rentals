"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

const API = process.env.NEXT_PUBLIC_API_URL ;

const STATUS_BADGE = {
  Pending:   'bg-yellow-100 text-yellow-800',
  Confirmed: 'bg-blue-100 text-blue-800',
  Completed: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
};

const PAYMENT_BADGE = {
  Unpaid: 'bg-red-50 text-red-600 border border-red-200',
  Paid:   'bg-green-50 text-green-700 border border-green-200',
};

export default function AdminBookingsPage() {
  const { token } = useAuth();
  const [bookings,     setBookings]     = useState([]);
  const [isLoading,    setIsLoading]    = useState(true);
  const [error,        setError]        = useState('');
  const [updatingId,   setUpdatingId]   = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const res = await fetch(`${API}/api/bookings/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch bookings');
        setBookings(await res.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [token]);

  const handleUpdate = async (id, payload) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`${API}/api/bookings/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) return alert(data.message || 'Update failed');
      // Patch local state — no full refetch needed
      setBookings(prev => prev.map(b => b._id === id ? data : b));
    } catch {
      alert('Network error');
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = filterStatus === 'all'
    ? bookings
    : bookings.filter(b => b.status === filterStatus);

  // Stats
  const stats = {
    total:     bookings.length,
    pending:   bookings.filter(b => b.status === 'Pending').length,
    confirmed: bookings.filter(b => b.status === 'Confirmed').length,
    revenue:   bookings.filter(b => b.paymentStatus === 'Paid').reduce((s, b) => s + (b.totalPrice || 0), 0),
  };

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin" />
    </div>
  );

  if (error) return <div className="text-red-500 font-bold p-6">{error}</div>;

  return (
    <div className="max-w-7xl">
      <h1 className="text-3xl font-black uppercase tracking-tighter mb-1">Manage Bookings</h1>
      <p className="text-xs text-gray-400 uppercase tracking-widest mb-8">
        Customers confirm their own payment — admin manages lifecycle status
      </p>

      {/* Stat strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Bookings', value: stats.total },
          { label: 'Pending Payment', value: stats.pending },
          { label: 'Confirmed Active', value: stats.confirmed },
          { label: 'Revenue (Paid)', value: `$${stats.revenue.toFixed(2)}` },
        ].map(s => (
          <div key={s.label} className="bg-white border border-gray-200 p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">{s.label}</p>
            <p className="text-2xl font-black">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-3 mb-6 items-center">
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="border border-gray-300 px-4 py-2 text-xs font-bold uppercase tracking-widest bg-white focus:outline-none focus:border-black"
        >
          <option value="all">All Statuses</option>
          {['Pending', 'Confirmed', 'Completed', 'Cancelled'].map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        {filterStatus !== 'all' && (
          <button
            onClick={() => setFilterStatus('all')}
            className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black border border-gray-300 px-4 py-2"
          >
            Clear ×
          </button>
        )}

        <span className="ml-auto text-xs text-gray-400">
          {filtered.length} result{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {['ID', 'Vehicle', 'Customer', 'Dates', 'Total', 'Status', 'Payment', 'Actions'].map(h => (
                <th key={h} className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500 whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan="8" className="p-10 text-center text-gray-400 text-sm">
                  No bookings found.
                </td>
              </tr>
            )}
            {filtered.map(b => {
              const busy = updatingId === b._id;
              return (
                <tr key={b._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">

                  {/* ID */}
                  <td className="p-4 font-mono text-xs text-gray-400">
                    {b._id.slice(-6).toUpperCase()}
                  </td>

                  {/* Vehicle */}
                  <td className="p-4">
                    <div className="font-bold text-sm">{b.car ? `${b.car.brand} ${b.car.model}` : '—'}</div>
                    {b.car?.location && <div className="text-xs text-gray-400">{b.car.location}</div>}
                  </td>

                  {/* Customer */}
                  <td className="p-4 text-sm">
                    <div className="font-medium">{b.user?.name || '—'}</div>
                    <div className="text-xs text-gray-400">{b.user?.email}</div>
                    {b.user?.phoneNumber && <div className="text-xs text-gray-400">{b.user.phoneNumber}</div>}
                  </td>

                  {/* Dates */}
                  <td className="p-4 text-xs text-gray-600 whitespace-nowrap">
                    <div>{new Date(b.startDate).toLocaleDateString()}</div>
                    <div className="text-gray-300">↓</div>
                    <div>{new Date(b.endDate).toLocaleDateString()}</div>
                  </td>

                  {/* Total */}
                  <td className="p-4 font-black text-sm">${b.totalPrice?.toFixed(2)}</td>

                  {/* Booking status */}
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-bold uppercase tracking-wide rounded-sm ${STATUS_BADGE[b.status]}`}>
                      {b.status}
                    </span>
                  </td>

                  {/* Payment status */}
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-bold uppercase tracking-wide rounded-sm ${PAYMENT_BADGE[b.paymentStatus]}`}>
                      {b.paymentStatus}
                    </span>
                    {b.paymentReference && (
                      <div className="text-xs font-mono text-gray-400 mt-1">{b.paymentReference}</div>
                    )}
                  </td>

                  {/* Actions — admin manages lifecycle, not payment */}
                  <td className="p-4 text-right">
                    <div className="flex flex-col items-end gap-2">

                      {/* Mark as Completed — only for confirmed + paid bookings */}
                      {b.status === 'Confirmed' && b.paymentStatus === 'Paid' && (
                        <button
                          disabled={busy}
                          onClick={() => handleUpdate(b._id, { status: 'Completed' })}
                          className="text-xs font-bold uppercase tracking-widest text-green-700 hover:underline disabled:opacity-50 whitespace-nowrap"
                        >
                          {busy ? '…' : 'Mark Complete'}
                        </button>
                      )}

                      {/* Cancel — available for Pending or Confirmed bookings */}
                      {(b.status === 'Pending' || b.status === 'Confirmed') && (
                        <button
                          disabled={busy}
                          onClick={() => handleUpdate(b._id, { status: 'Cancelled' })}
                          className="text-xs font-bold uppercase tracking-widest text-red-600 hover:underline disabled:opacity-50"
                        >
                          {busy ? '…' : 'Cancel'}
                        </button>
                      )}

                      {/* Nothing to do */}
                      {(b.status === 'Completed' || b.status === 'Cancelled') && (
                        <span className="text-xs text-gray-300 uppercase tracking-widest">—</span>
                      )}

                    </div>
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}