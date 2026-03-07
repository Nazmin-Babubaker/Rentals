"use client";

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!loading && mounted) {
      if (!user || user.role !== 'admin') {
        router.push('/');
      }
    }
  }, [user, loading, mounted, router]);

  if (loading || !mounted || !user || user.role !== 'admin') {
    return (
      <div className="flex w-full min-h-[calc(100vh-160px)] items-center justify-center">
        <p className="font-bold tracking-widest uppercase text-sm">Verifying Access...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-64px)] w-full bg-white text-black font-sans">
      
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 border-r border-gray-200 bg-gray-50 flex-shrink-0">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-black uppercase tracking-tighter">Admin Portal</h2>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">Command Center</p>
        </div>
        <nav className="p-4 space-y-2">
          <Link href="/admin" className="block px-4 py-3 text-sm font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors">
            Dashboard
          </Link>
          <Link href="/admin/cars" className="block px-4 py-3 text-sm font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors">
            Manage Fleet
          </Link>
          <Link href="/admin/bookings" className="block px-4 py-3 text-sm font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors">
            Manage Bookings
          </Link>
          <Link href="/admin/users" className="block px-4 py-3 text-sm font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors">
            Manage Users
          </Link>
        </nav>
      </aside>

      {/* Admin Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
      
    </div>
  );
}
