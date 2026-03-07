"use client";

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 fixed w-full z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-black text-black tracking-tighter hover:opacity-80 transition-opacity">
              DRIVE.
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
            <Link href="/" className="text-gray-900 border-b-2 border-transparent hover:border-black px-1 pt-1 text-sm font-medium transition-colors">
              Home
            </Link>
            <Link href="/cars" className="text-gray-500 hover:text-gray-900 border-b-2 border-transparent hover:border-black px-1 pt-1 text-sm font-medium transition-colors">
              Cars
            </Link>
            <Link href="/about" className="text-gray-500 hover:text-gray-900 border-b-2 border-transparent hover:border-black px-1 pt-1 text-sm font-medium transition-colors">
              About
            </Link>
          </div>

          {/* Call to Action */}
          <div className="hidden sm:flex items-center">
            {user ? (
              <>
                <Link href="/profile" className="text-sm font-bold tracking-widest uppercase hover:text-gray-500 transition-colors">
                  {user.name}
                </Link>
                <button onClick={logout} className="ml-6 px-6 py-2.5 border-2 border-black text-black text-sm font-bold uppercase tracking-wider hover:bg-black hover:text-white transition-colors">
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-bold tracking-widest uppercase hover:text-gray-500 transition-colors">
                  Log In
                </Link>
                <Link href="/signup" className="ml-6 px-6 py-2.5 bg-black text-white text-sm font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button (placeholder) */}
          <div className="flex items-center sm:hidden">
            <button className="text-gray-500 hover:text-gray-700 p-2">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
