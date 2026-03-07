"use client";

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 fixed w-full z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-gray-700">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 16H9m10 0h3v-3.15a1 1 0 00-.84-.99L16 11l-2.7-3.6a1 1 0 00-.8-.4H8.5a1 1 0 00-.8.4L5 11l-5.16.86a1 1 0 00-.84.99V16h3m10 0a2 2 0 100-4 2 2 0 000 4zm-10 0a2 2 0 100-4 2 2 0 000 4z"/>
                </svg>
              </div>
              <span className="font-semibold text-gray-900 tracking-tight text-lg">rental.co</span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden sm:flex sm:flex-1 sm:justify-center sm:space-x-8">
            <Link href="/" className="text-gray-500 hover:text-gray-900 px-1 py-1 text-sm font-medium transition-colors">
              Home
            </Link>
            <Link href="/cars" className="text-gray-500 hover:text-gray-900 px-1 py-1 text-sm font-medium transition-colors">
              Fleet
            </Link>
            
            <Link href="/about" className="text-gray-500 hover:text-gray-900 px-1 py-1 text-sm font-medium transition-colors">
              About
            </Link>
          </div>

          {/* Call to Action */}
          <div className="hidden sm:flex items-center space-x-4">
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link href="/admin" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
                    Admin
                  </Link>
                )}
                <Link href="/profile" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
                  {user.name}
                </Link>
                <button onClick={logout} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors">
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors">
                  Log In
                </Link>
                <Link href="/signup" className="px-4 py-2 text-sm font-medium text-white bg-slate-800 hover:bg-slate-700 transition-colors">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-500 hover:text-gray-700 p-2">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="sm:hidden bg-white border-b border-gray-200 shadow-lg absolute w-full">
          <div className="pt-2 pb-4 space-y-1">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="block pl-3 pr-4 py-2 text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 border-l-4 border-transparent hover:border-gray-500">Home</Link>
            <Link href="/cars" onClick={() => setIsMobileMenuOpen(false)} className="block pl-3 pr-4 py-2 text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 border-l-4 border-transparent hover:border-gray-500">Fleet</Link>
            <Link href="/locations" onClick={() => setIsMobileMenuOpen(false)} className="block pl-3 pr-4 py-2 text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 border-l-4 border-transparent hover:border-gray-500">Locations</Link>
            <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="block pl-3 pr-4 py-2 text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 border-l-4 border-transparent hover:border-gray-500">About</Link>
            
            <div className="border-t border-gray-200 pt-4 mt-2">
              {user ? (
                <>
                  <div className="px-4 mb-2">
                    <p className="text-base font-medium text-gray-800">{user.name}</p>
                    <p className="text-sm font-medium text-gray-500">{user.email}</p>
                  </div>
                  {user.role === 'admin' && (
                    <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="block pl-3 pr-4 py-2 text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 border-l-4 border-transparent hover:border-gray-500">Admin</Link>
                  )}
                  <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)} className="block pl-3 pr-4 py-2 text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 border-l-4 border-transparent hover:border-gray-500">Profile</Link>
                  <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="block w-full text-left pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 border-l-4 border-transparent hover:border-gray-500">
                    Log Out
                  </button>
                </>
              ) : (
                <div className="space-y-2 mt-4 px-4 pb-2">
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="block w-full text-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors">Log In</Link>
                  <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)} className="block w-full text-center px-4 py-2 text-sm font-medium text-white bg-slate-800 hover:bg-slate-700 transition-colors">Sign Up</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
