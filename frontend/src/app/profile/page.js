"use client";

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, token, loading, logout } = useAuth();
  const router = useRouter();
  const [profileData, setProfileData] = useState(null);
  const [isFetching, setIsFetching] = useState(true);

  // Protected route logic
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Fetch complete profile details
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return;
      
      try {
        const res = await fetch('http://localhost:5000/auth/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (res.ok) {
          const data = await res.json();
          setProfileData(data);
        }
      } catch (error) {
        console.error("Failed to fetch profile", error);
      } finally {
        setIsFetching(false);
      }
    };

    if (user && token) {
      fetchProfile();
    }
  }, [user, token]);

  if (loading || isFetching) {
    return (
      <div className="flex w-full min-h-[calc(100vh-160px)] items-center justify-center">
        <p className="font-bold tracking-widest uppercase text-sm">Loading...</p>
      </div>
    );
  }

  if (!user) return null; // Will redirect

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-160px)] bg-white text-black font-sans py-20 px-4">
      <div className="w-full max-w-4xl mx-auto">
        
        {/* Header Setup */}
        <div className="flex justify-between items-end mb-16 border-b border-gray-200 pb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-2">
              My Profile
            </h1>
            <p className="text-gray-500 font-light">
              Manage your credentials and view your rental history.
            </p>
          </div>
          <button 
            onClick={logout}
            className="text-xs font-bold uppercase tracking-widest text-red-600 border border-red-600 px-4 py-2 hover:bg-red-600 hover:text-white transition-colors duration-200"
          >
            Log Out
          </button>
        </div>

        {/* Profile Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          {/* Main Info Box */}
          <div className="md:col-span-2 space-y-12">
            <section>
              <h2 className="text-sm font-bold tracking-widest uppercase text-gray-400 mb-6">Personal Information</h2>
              
              <div className="bg-gray-50 p-8 border border-gray-200 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <span className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Full Name</span>
                    <span className="text-lg font-medium">{profileData?.name || user.name}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Email Address</span>
                    <span className="text-lg font-medium">{profileData?.email || user.email}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Phone Number</span>
                    <span className="text-lg font-medium">{profileData?.phoneNumber || 'Not provided'}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Account Role</span>
                    <span className="text-lg font-medium capitalize">{profileData?.role || user.role || 'User'}</span>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-gray-200">
                  <button className="text-xs font-bold uppercase tracking-widest text-black underline underline-offset-4 hover:text-gray-600">
                    Edit Information
                  </button>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-sm font-bold tracking-widest uppercase text-gray-400 mb-6">Recent Activity</h2>
              <div className="border border-gray-200 p-12 text-center bg-gray-50">
                <p className="text-gray-500">You have no active or pastel rental bookings.</p>
                <Link href="/cars" className="inline-block mt-4 text-xs font-bold uppercase tracking-widest text-black border border-black px-6 py-3 hover:bg-black hover:text-white transition-colors duration-200">
                  Browse Fleet
                </Link>
              </div>
            </section>
          </div>

          {/* Sidebar / Settings */}
          <div className="md:col-span-1 border-l border-gray-200 pl-8">
            <h2 className="text-sm font-bold tracking-widest uppercase text-gray-400 mb-6">Account Settings</h2>
            <ul className="space-y-4">
              <li>
                <button className="text-sm font-bold hover:underline underline-offset-4">Change Password</button>
              </li>
              <li>
                <button className="text-sm font-bold hover:underline underline-offset-4">Payment Methods</button>
              </li>
              <li>
                <button className="text-sm font-bold hover:underline underline-offset-4">Communication Preferences</button>
              </li>
            </ul>

            <div className="mt-16 pt-8 border-t border-gray-200">
               <button className="text-sm font-bold text-red-600 hover:underline underline-offset-4">Delete Account</button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
