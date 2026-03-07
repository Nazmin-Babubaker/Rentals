"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const fullName = `${firstName} ${lastName}`.trim();
    const result = await register(fullName, email, password);
    
    if (result.success) {
      // Once registered, you could auto-login, but typically redirecting to log in is standard
      router.push('/login');
    } else {
      setError(result.message || 'Failed to create account');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-160px)] bg-white text-black font-sans items-center justify-center py-20 px-4">
      <div className="w-full max-w-md">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">
            Join Drive
          </h1>
          <p className="text-gray-500 font-light">
            Create an account to reserve and manage your premium vehicles.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 text-sm font-bold text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
               <label htmlFor="firstName" className="block text-xs font-bold text-gray-500 uppercase tracking-widest">
                 First Name
               </label>
               <input 
                 id="firstName" 
                 name="firstName" 
                 type="text" 
                 value={firstName}
                 onChange={(e) => setFirstName(e.target.value)}
                 required 
                 className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                 placeholder="Jane"
               />
             </div>
             <div className="space-y-2">
               <label htmlFor="lastName" className="block text-xs font-bold text-gray-500 uppercase tracking-widest">
                 Last Name
               </label>
               <input 
                 id="lastName" 
                 name="lastName" 
                 type="text" 
                 value={lastName}
                 onChange={(e) => setLastName(e.target.value)}
                 required 
                 className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                 placeholder="Doe"
               />
             </div>
          </div>

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
            <label htmlFor="password" className="block text-xs font-bold text-gray-500 uppercase tracking-widest">
              Password
            </label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password" 
              required 
              className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
              placeholder="••••••••"
            />
            <p className="text-xs text-gray-500 mt-2">Must be at least 8 characters long.</p>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-4 mt-8 text-sm font-bold tracking-widest uppercase text-white bg-black hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300 flex justify-center items-center"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {/* Legal text */}
        <p className="text-xs text-gray-400 mt-6 text-center leading-relaxed">
          By continuing, you agree to DRIVE's <Link href="#" className="underline hover:text-gray-800">Terms of Service</Link> and <Link href="#" className="underline hover:text-gray-800">Privacy Policy</Link>.
        </p>

        {/* Divider */}
        <div className="mt-8 mb-8 flex items-center justify-center">
          <div className="w-full h-[1px] bg-gray-200"></div>
          <span className="px-4 text-xs font-bold text-gray-400 uppercase tracking-widest bg-white">Or</span>
          <div className="w-full h-[1px] bg-gray-200"></div>
        </div>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="font-bold text-black uppercase tracking-widest hover:underline underline-offset-4">
              Sign In
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
