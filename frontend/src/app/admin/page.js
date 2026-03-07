"use client";

import Link from 'next/link';

export default function AdminDashboardPage() {
  return (
    <div className="max-w-6xl">
      <h1 className="text-4xl font-black uppercase tracking-tighter mb-8">
        Welcome to Mission Control
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Fleet Widget */}
        <div className="bg-gray-50 border border-gray-200 p-8">
          <h2 className="text-sm font-bold tracking-widest uppercase text-gray-500 mb-2">Fleet Status</h2>
          <p className="text-5xl font-black mb-6">12</p>
          <p className="text-sm text-gray-600 mb-8">Active vehicles in the system.</p>
          <Link href="/admin/cars" className="inline-block text-xs font-bold uppercase tracking-widest text-white bg-black px-6 py-3 hover:bg-gray-800 transition-colors">
            Manage Cars
          </Link>
        </div>

        {/* Bookings Widget */}
        <div className="bg-gray-50 border border-gray-200 p-8">
          <h2 className="text-sm font-bold tracking-widest uppercase text-gray-500 mb-2">Recent Bookings</h2>
          <p className="text-5xl font-black mb-6">4</p>
          <p className="text-sm text-gray-600 mb-8">Pending approval or active.</p>
          <Link href="/admin/bookings" className="inline-block text-xs font-bold uppercase tracking-widest text-white bg-black px-6 py-3 hover:bg-gray-800 transition-colors">
            View Bookings
          </Link>
        </div>

        {/* Users Widget */}
        <div className="bg-gray-50 border border-gray-200 p-8">
          <h2 className="text-sm font-bold tracking-widest uppercase text-gray-500 mb-2">User Accounts</h2>
          <p className="text-5xl font-black mb-6">24</p>
          <p className="text-sm text-gray-600 mb-8">Registered platform users.</p>
          <Link href="/admin/users" className="inline-block text-xs font-bold uppercase tracking-widest text-white bg-black px-6 py-3 hover:bg-gray-800 transition-colors">
            Manage Users
          </Link>
        </div>
        
      </div>
    </div>
  );
}
