"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function AdminDashboardPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState({ cars: 0, bookings: 0, users: 0, pendingPayments: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    const fetchStats = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [carsRes, bookingsRes, usersRes] = await Promise.all([
          fetch(`${API}/api/cars?all=true`),
          fetch(`${API}/api/bookings/all`, { headers }),
          fetch(`${API}/api/users`, { headers }),
        ]);

        const [cars, bookings, users] = await Promise.all([
          carsRes.json(), bookingsRes.json(), usersRes.json()
        ]);

        const pendingBookings = bookings.filter(b => b.status === 'Pending').length;
        const revenue = bookings
          .filter(b => b.paymentStatus === 'Paid')
          .reduce((sum, b) => sum + b.totalPrice, 0);

        setStats({ cars: cars.length, bookings: bookings.length, users: users.length, pendingBookings, revenue });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [token]);

  return (
    <div className="max-w-6xl">
      <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">
        Mission Control
      </h1>
      <p className="text-sm text-gray-400 uppercase tracking-widest mb-10">Live platform overview</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

        {/* Fleet */}
        <div className="bg-gray-50 border border-gray-200 p-8">
          <h2 className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-3">Fleet Status</h2>
          <p className="text-6xl font-black mb-1">{loading ? '—' : stats.cars}</p>
          <p className="text-sm text-gray-500 mb-8">Vehicles in the system</p>
          <Link href="/admin/cars" className="inline-block text-xs font-bold uppercase tracking-widest text-white bg-black px-6 py-3 hover:bg-gray-800 transition-colors">
            Manage Fleet
          </Link>
        </div>

        {/* Bookings */}
        <div className="bg-gray-50 border border-gray-200 p-8">
          <h2 className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-3">Total Bookings</h2>
          <p className="text-6xl font-black mb-1">{loading ? '—' : stats.bookings}</p>
          <p className="text-sm text-gray-500 mb-8">Across all statuses</p>
          <Link href="/admin/bookings" className="inline-block text-xs font-bold uppercase tracking-widest text-white bg-black px-6 py-3 hover:bg-gray-800 transition-colors">
            View Bookings
          </Link>
        </div>

        {/* Users */}
        <div className="bg-gray-50 border border-gray-200 p-8">
          <h2 className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-3">User Accounts</h2>
          <p className="text-6xl font-black mb-1">{loading ? '—' : stats.users}</p>
          <p className="text-sm text-gray-500 mb-8">Registered platform users</p>
          <Link href="/admin/users" className="inline-block text-xs font-bold uppercase tracking-widest text-white bg-black px-6 py-3 hover:bg-gray-800 transition-colors">
            Manage Users
          </Link>
        </div>

      </div>

      {/* Revenue stat */}
      <div className="border border-gray-200 bg-white p-8 flex items-center justify-between">
        <div>
          <h2 className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-2">Confirmed Revenue</h2>
          <p className="text-4xl font-black">{loading ? '—' : `$${stats.revenue.toFixed(2)}`}</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-2">Awaiting Confirmation</p>
          <p className={`text-4xl font-black ${stats.pendingPayments > 0 ? 'text-yellow-600' : ''}`}>
            {loading ? '—' : stats.pendingPayments}
          </p>
        </div>
      </div>
    </div>
  );
}