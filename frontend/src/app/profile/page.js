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
  
  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', phoneNumber: '' });
  const [isSaving, setIsSaving] = useState(false);

  // Password State
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordStatus, setPasswordStatus] = useState({ type: '', message: '' });
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);

  // Protected route logic
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const fetchProfile = async () => {
    if (!token) return;
    try {
      const res = await fetch('http://localhost:5000/auth/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProfileData(data);
        setEditForm({ name: data.name || '', phoneNumber: data.phoneNumber || '' });
      }
    } catch (error) {
      console.error("Failed to fetch profile", error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (user && token) {
      fetchProfile();
    }
  }, [user, token]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('http://localhost:5000/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      });
      if (res.ok) {
        await fetchProfile();
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Failed to update profile", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to permanently delete your account? This action cannot be undone.")) {
      try {
        const res = await fetch('http://localhost:5000/auth/profile', {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          logout(); // Clears context and redirects
        }
      } catch (error) {
        console.error("Failed to delete account", error);
      }
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setPasswordStatus({ type: '', message: '' });
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return setPasswordStatus({ type: 'error', message: 'New passwords do not match.' });
    }
    if (passwordForm.newPassword.length < 8) {
      return setPasswordStatus({ type: 'error', message: 'New password must be at least 8 characters long.' });
    }

    setIsPasswordSaving(true);
    try {
      const res = await fetch('http://localhost:5000/auth/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword })
      });
      const data = await res.json();
      if (res.ok) {
        setPasswordStatus({ type: 'success', message: 'Password updated successfully.' });
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => { setIsChangingPassword(false); setPasswordStatus({ type: '', message: '' }); }, 3000);
      } else {
        setPasswordStatus({ type: 'error', message: data.message || 'Failed to update password.' });
      }
    } catch (error) {
      console.error("Password update error", error);
      setPasswordStatus({ type: 'error', message: 'An error occurred.' });
    } finally {
      setIsPasswordSaving(false);
    }
  };

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
              
              <div className="bg-gray-50 p-8 border border-gray-200">
                {isEditing ? (
                  <form onSubmit={handleUpdate} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Full Name</label>
                        <input 
                          type="text" 
                          value={editForm.name} 
                          onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Phone Number</label>
                        <input 
                          type="text" 
                          value={editForm.phoneNumber} 
                          onChange={(e) => setEditForm({...editForm, phoneNumber: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                        />
                      </div>
                      <div className="space-y-2 sm:col-span-2 opacity-50">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Email Address</label>
                        <input type="text" value={profileData?.email || user.email} disabled className="w-full px-4 py-3 border border-gray-300 bg-gray-100" />
                        <p className="text-xs text-gray-400 mt-1">Email cannot be changed directly.</p>
                      </div>
                    </div>
                    
                    <div className="pt-6 border-t border-gray-200 flex gap-4">
                      <button type="submit" disabled={isSaving} className="text-xs font-bold uppercase tracking-widest text-white bg-black px-6 py-3 hover:bg-gray-800 transition-colors">
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button type="button" onClick={() => setIsEditing(false)} className="text-xs font-bold uppercase tracking-widest text-black border border-black px-6 py-3 hover:bg-gray-100 transition-colors">
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
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
                      <button onClick={() => setIsEditing(true)} className="text-xs font-bold uppercase tracking-widest text-black underline underline-offset-4 hover:text-gray-600">
                        Edit Information
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {isChangingPassword && (
              <section>
                <h2 className="text-sm font-bold tracking-widest uppercase text-gray-400 mb-6">Change Password</h2>
                <div className="bg-gray-50 p-8 border border-gray-200">
                  {passwordStatus.message && (
                    <div className={`mb-6 p-4 text-sm font-bold text-center border ${passwordStatus.type === 'error' ? 'bg-red-50 border-red-200 text-red-600' : 'bg-green-50 border-green-200 text-green-600'}`}>
                      {passwordStatus.message}
                    </div>
                  )}
                  <form onSubmit={handlePasswordUpdate} className="space-y-6">
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Current Password</label>
                      <input type="password" required value={passwordForm.currentPassword} onChange={e => setPasswordForm({...passwordForm, currentPassword: e.target.value})} className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">New Password</label>
                      <input type="password" required value={passwordForm.newPassword} onChange={e => setPasswordForm({...passwordForm, newPassword: e.target.value})} className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Confirm New Password</label>
                      <input type="password" required value={passwordForm.confirmPassword} onChange={e => setPasswordForm({...passwordForm, confirmPassword: e.target.value})} className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors" />
                    </div>
                    <div className="pt-6 border-t border-gray-200 flex gap-4">
                      <button type="submit" disabled={isPasswordSaving} className="text-xs font-bold uppercase tracking-widest text-white bg-black px-6 py-3 hover:bg-gray-800 transition-colors disabled:opacity-50">
                        {isPasswordSaving ? 'Saving...' : 'Update Password'}
                      </button>
                      <button type="button" onClick={() => {setIsChangingPassword(false); setPasswordStatus({type: '', message: ''})}} className="text-xs font-bold uppercase tracking-widest text-black border border-black px-6 py-3 hover:bg-gray-100 transition-colors">
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </section>
            )}

            <section>
              <h2 className="text-sm font-bold tracking-widest uppercase text-gray-400 mb-6">Recent Activity</h2>
              <div className="border border-gray-200 p-12 text-center bg-gray-50">
                <p className="text-gray-500">You have no active or past rental bookings.</p>
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
                <button onClick={() => setIsChangingPassword(true)} className="text-sm font-bold hover:underline underline-offset-4">Change Password</button>
              </li>
              <li>
                <button className="text-sm font-bold hover:underline underline-offset-4">Payment Methods</button>
              </li>
              <li>
                <button className="text-sm font-bold hover:underline underline-offset-4">Communication Preferences</button>
              </li>
            </ul>

            <div className="mt-16 pt-8 border-t border-gray-200">
               <button onClick={handleDelete} className="text-sm font-bold text-red-600 hover:underline underline-offset-4">
                 Delete Account
               </button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
