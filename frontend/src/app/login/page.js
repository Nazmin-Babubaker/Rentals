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
      router.push('/cars');
    } else {
      setError(result.message || 'Failed to login');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-160px)] bg-white/50 text-black items-center justify-center py-20 px-4">
      <div className="w-full max-w-md bg-white border border-gray-300 rounded-lg p-8 sm:p-10 shadow-sm">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Login
          </h1>
          <p className="text-sm text-gray-500">
            Access your car rental account
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-sm font-medium rounded text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
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
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-colors"
              placeholder="your@email.com"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
              Password
            </label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password" 
              required 
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-colors"
              placeholder="••••••••"
            />
            <div className="flex justify-end mt-2">
              <Link href="#" className="text-sm text-gray-500 hover:text-gray-800 transition-colors underline decoration-gray-400 underline-offset-4">
                Forgot password?
              </Link>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-3 mt-4 text-sm font-semibold text-white bg-[#1e2329] rounded hover:bg-black disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex justify-center items-center shadow-sm"
          >
            {isLoading ? 'Logging In...' : 'Login'}
          </button>
        </form>

        {/* Create Account Link */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="font-semibold text-gray-900 hover:underline underline-offset-4">
              Register here
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
