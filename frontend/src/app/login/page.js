"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const result = await login(email, password);
    
    if (result.success) {
      router.push('/');
    } else {
      setError(result.message || 'Failed to login');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-160px)] bg-white text-black font-sans items-center justify-center py-20 px-4">
      <div className="w-full max-w-md">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">
            Sign In
          </h1>
          <p className="text-gray-500 font-light">
            Enter your details to access your DRIVE account.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 text-sm font-bold text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-xs font-bold text-gray-500 uppercase tracking-widest">
              Email Address
            </label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email" 
              required 
              className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
              placeholder="name@example.com"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="password" className="block text-xs font-bold text-gray-500 uppercase tracking-widest">
                Password
              </label>
              <Link href="#" className="text-xs font-bold text-black uppercase tracking-widest hover:underline hover:text-gray-600 transition-colors">
                Forgot?
              </Link>
            </div>
            <input 
              id="password" 
              name="password" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password" 
              required 
              className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-4 mt-8 text-sm font-bold tracking-widest uppercase text-white bg-black hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300 flex justify-center items-center"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Divider */}
        <div className="mt-10 mb-8 flex items-center justify-center">
          <div className="w-full h-[1px] bg-gray-200"></div>
          <span className="px-4 text-xs font-bold text-gray-400 uppercase tracking-widest bg-white">Or</span>
          <div className="w-full h-[1px] bg-gray-200"></div>
        </div>

        {/* Create Account Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/signup" className="font-bold text-black uppercase tracking-widest hover:underline underline-offset-4">
              Create One
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
