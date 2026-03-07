"use client";

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import PaymentModal from '@/components/PaymentModal';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const STATUS_COLOR = {
  Completed: 'text-green-600',
  Cancelled:  'text-red-600',
  Confirmed:  'text-blue-600',
  Pending:    'text-yellow-600',
};

const PAYMENT_BADGE = {
  Unpaid:  'bg-red-50 text-red-600 border-red-200',
  Pending: 'bg-yellow-50 text-yellow-700 border-yellow-300',
  Paid:    'bg-green-50 text-green-700 border-green-200',
};

export default function ProfilePage() {
  const { user, token, loading, logout } = useAuth();
  const router = useRouter();

  const [profileData, setProfileData]   = useState(null);
  const [isFetching, setIsFetching]     = useState(true);

  // Edit state
  const [isEditing, setIsEditing]       = useState(false);
  const [editForm, setEditForm]         = useState({ name: '', phoneNumber: '' });
  const [isSaving, setIsSaving]         = useState(false);

  // Password state
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordStatus, setPasswordStatus] = useState({ type: '', message: '' });
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);

  // Bookings state
  const [bookings, setBookings]         = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  // Payment modal state
  const [paymentBooking, setPaymentBooking] = useState(null);

  // ── Auth guard ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  // ── Fetch profile + bookings on mount ──────────────────────────────────────
  useEffect(() => {
    if (user && token) {
      fetchProfile();
      fetchMyBookings();
    }
  }, [user, token]);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${API}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setProfileData(data);
        setEditForm({ name: data.name || '', phoneNumber: data.phoneNumber || '' });
      }
    } catch (err) {
      console.error('Failed to fetch profile', err);
    } finally {
      setIsFetching(false);
    }
  };

  const fetchMyBookings = async () => {
    try {
      const res = await fetch(`${API}/api/bookings/my-bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setBookings(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingBookings(false);
    }
  };

  // ── Cancel booking ─────────────────────────────────────────────────────────
  const handleCancelBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) return;
    setCancellingId(id);
    try {
      const res = await fetch(`${API}/api/bookings/${id}/cancel`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setBookings(prev =>
          prev.map(b => b._id === id ? { ...b, status: 'Cancelled' } : b)
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCancellingId(null);
    }
  };

  // ── Payment success callback ───────────────────────────────────────────────
  const handlePaymentSuccess = (updatedBooking) => {
    setBookings(prev =>
      prev.map(b => b._id === updatedBooking._id ? updatedBooking : b)
    );
    setPaymentBooking(null);
  };

  // ── Update profile ─────────────────────────────────────────────────────────
  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch(`${API}/api/auth/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(editForm),
      });
      if (res.ok) { await fetchProfile(); setIsEditing(false); }
    } catch (err) {
      console.error('Failed to update profile', err);
    } finally {
      setIsSaving(false);
    }
  };

  // ── Delete account ─────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!window.confirm('Permanently delete your account? This cannot be undone.')) return;
    try {
      const res = await fetch(`${API}/api/auth/profile`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) logout();
    } catch (err) {
      console.error('Failed to delete account', err);
    }
  };

  // ── Change password ────────────────────────────────────────────────────────
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setPasswordStatus({ type: '', message: '' });
    if (passwordForm.newPassword !== passwordForm.confirmPassword)
      return setPasswordStatus({ type: 'error', message: 'New passwords do not match.' });
    if (passwordForm.newPassword.length < 8)
      return setPasswordStatus({ type: 'error', message: 'Password must be at least 8 characters.' });

    setIsPasswordSaving(true);
    try {
      const res = await fetch(`${API}/api/auth/change-password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setPasswordStatus({ type: 'success', message: 'Password updated successfully.' });
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => { setIsChangingPassword(false); setPasswordStatus({ type: '', message: '' }); }, 3000);
      } else {
        setPasswordStatus({ type: 'error', message: data.message || 'Failed to update password.' });
      }
    } catch {
      setPasswordStatus({ type: 'error', message: 'An error occurred.' });
    } finally {
      setIsPasswordSaving(false);
    }
  };

  // ── Loading / guard ────────────────────────────────────────────────────────
  if (loading || isFetching) {
    return (
      <div className="flex w-full min-h-[calc(100vh-160px)] items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin" />
      </div>
    );
  }
  if (!user) return null;

  const inputCls = "w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors";

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-160px)] bg-white text-black font-sans py-20 px-4">
      <div className="w-full max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-end mb-16 border-b border-gray-200 pb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-2">My Profile</h1>
            <p className="text-gray-500 font-light">Manage your credentials and view your rental history.</p>
          </div>
          <button
            onClick={logout}
            className="text-xs font-bold uppercase tracking-widest text-red-600 border border-red-600 px-4 py-2 hover:bg-red-600 hover:text-white transition-colors"
          >
            Log Out
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* ── Main column ── */}
          <div className="md:col-span-2 space-y-12">

            {/* Personal Info */}
            <section>
              <h2 className="text-sm font-bold tracking-widest uppercase text-gray-400 mb-6">Personal Information</h2>
              <div className="bg-gray-50 p-8 border border-gray-200">
                {isEditing ? (
                  <form onSubmit={handleUpdate} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Full Name</label>
                        <input type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className={inputCls} />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Phone Number</label>
                        <input type="text" value={editForm.phoneNumber} onChange={e => setEditForm({...editForm, phoneNumber: e.target.value})} className={inputCls} />
                      </div>
                      <div className="space-y-2 sm:col-span-2 opacity-50">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Email Address</label>
                        <input type="text" value={profileData?.email || user.email} disabled className={`${inputCls} bg-gray-100`} />
                        <p className="text-xs text-gray-400 mt-1">Email cannot be changed.</p>
                      </div>
                    </div>
                    <div className="pt-6 border-t border-gray-200 flex gap-4">
                      <button type="submit" disabled={isSaving} className="text-xs font-bold uppercase tracking-widest text-white bg-black px-6 py-3 hover:bg-gray-800 disabled:opacity-50 transition-colors">
                        {isSaving ? 'Saving…' : 'Save Changes'}
                      </button>
                      <button type="button" onClick={() => setIsEditing(false)} className="text-xs font-bold uppercase tracking-widest text-black border border-black px-6 py-3 hover:bg-gray-100 transition-colors">
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {[
                        ['Full Name', profileData?.name || user.name],
                        ['Email Address', profileData?.email || user.email],
                        ['Phone Number', profileData?.phoneNumber || 'Not provided'],
                        ['Account Role', profileData?.role || user.role || 'User'],
                      ].map(([label, val]) => (
                        <div key={label}>
                          <span className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">{label}</span>
                          <span className="text-lg font-medium capitalize">{val}</span>
                        </div>
                      ))}
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

            {/* Change Password (toggle) */}
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
                    {[
                      ['Current Password', 'currentPassword'],
                      ['New Password', 'newPassword'],
                      ['Confirm New Password', 'confirmPassword'],
                    ].map(([label, key]) => (
                      <div key={key} className="space-y-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">{label}</label>
                        <input type="password" required value={passwordForm[key]} onChange={e => setPasswordForm({...passwordForm, [key]: e.target.value})} className={inputCls} />
                      </div>
                    ))}
                    <div className="pt-6 border-t border-gray-200 flex gap-4">
                      <button type="submit" disabled={isPasswordSaving} className="text-xs font-bold uppercase tracking-widest text-white bg-black px-6 py-3 hover:bg-gray-800 disabled:opacity-50 transition-colors">
                        {isPasswordSaving ? 'Saving…' : 'Update Password'}
                      </button>
                      <button type="button" onClick={() => { setIsChangingPassword(false); setPasswordStatus({ type: '', message: '' }); }} className="text-xs font-bold uppercase tracking-widest text-black border border-black px-6 py-3 hover:bg-gray-100 transition-colors">
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </section>
            )}

            {/* ── Recent Activity (Bookings) ── */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-bold tracking-widest uppercase text-gray-400">Recent Activity</h2>
                {bookings.length > 0 && (
                  <Link href="/bookings" className="text-xs font-bold uppercase tracking-widest text-black underline underline-offset-4 hover:text-gray-500">
                    View All
                  </Link>
                )}
              </div>

              {loadingBookings ? (
                <div className="border border-gray-200 p-12 text-center bg-gray-50">
                  <div className="w-6 h-6 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto" />
                </div>
              ) : bookings.length === 0 ? (
                <div className="border border-gray-200 p-12 text-center bg-gray-50">
                  <p className="text-gray-500 mb-4">You have no active or past rental bookings.</p>
                  <Link href="/cars" className="inline-block text-xs font-bold uppercase tracking-widest text-white bg-black px-6 py-3 hover:bg-gray-800 transition-colors">
                    Browse Fleet
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map(b => {
                    const canPay = b.status !== 'Cancelled' && b.status !== 'Completed' && b.paymentStatus === 'Unpaid';
                    const canCancel = b.status !== 'Cancelled' && b.status !== 'Completed';

                    return (
                      <div
                        key={b._id}
                        className={`border p-6 bg-white flex flex-col md:flex-row justify-between md:items-start gap-4 ${
                          b.paymentStatus === 'Pending' ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200'
                        }`}
                      >
                        {/* Left: car + dates */}
                        <div className="flex-1">
                          <h3 className="text-lg font-black uppercase mb-1">
                            {b.car?.brand} {b.car?.model}
                          </h3>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                            {b.car?.location}
                          </p>
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                            {new Date(b.startDate).toLocaleDateString()} → {new Date(b.endDate).toLocaleDateString()}
                          </p>

                          {/* Status badges */}
                          <div className="flex flex-wrap gap-2">
                            <span className={`text-xs font-bold uppercase tracking-widest ${STATUS_COLOR[b.status] || 'text-gray-600'}`}>
                              {b.status}
                            </span>
                            <span className="text-gray-300">·</span>
                            <span className={`text-xs font-bold uppercase tracking-widest px-2 py-0.5 border rounded-sm ${PAYMENT_BADGE[b.paymentStatus]}`}>
                              {b.paymentStatus}
                            </span>
                          </div>

                          {/* Payment reference if exists */}
                          {b.paymentReference && (
                            <p className="text-[10px] font-mono text-gray-400 mt-2">
                              Ref: {b.paymentReference}
                            </p>
                          )}

                          {/* Awaiting admin note */}
                          {b.paymentStatus === 'Pending' && (
                            <p className="text-[10px] font-bold uppercase tracking-widest text-yellow-700 mt-2">
                              ● Awaiting admin confirmation
                            </p>
                          )}
                        </div>

                        {/* Right: price + actions */}
                        <div className="flex flex-col items-end gap-3 shrink-0">
                          <p className="text-2xl font-black font-mono">${b.totalPrice?.toFixed(2)}</p>

                          {/* PAY NOW — primary CTA */}
                          {canPay && (
                            <button
                              onClick={() => setPaymentBooking(b)}
                              className="text-xs font-bold uppercase tracking-widest text-white bg-black px-6 py-3 hover:bg-gray-800 transition-colors whitespace-nowrap"
                            >
                              Pay Now
                            </button>
                          )}

                          {canCancel && (
                            <button
                              onClick={() => handleCancelBooking(b._id)}
                              disabled={cancellingId === b._id}
                              className="text-xs font-bold uppercase tracking-widest text-red-600 border border-red-300 px-4 py-2 hover:bg-red-50 transition-colors disabled:opacity-50 whitespace-nowrap"
                            >
                              {cancellingId === b._id ? 'Cancelling…' : 'Cancel'}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>

          {/* ── Sidebar ── */}
          <div className="md:col-span-1 border-l border-gray-200 pl-8">
            <h2 className="text-sm font-bold tracking-widest uppercase text-gray-400 mb-6">Account Settings</h2>
            <ul className="space-y-4">
              <li>
                <button
                  onClick={() => setIsChangingPassword(true)}
                  className="text-sm font-bold hover:underline underline-offset-4"
                >
                  Change Password
                </button>
              </li>
              <li>
                <Link href="/bookings" className="text-sm font-bold hover:underline underline-offset-4">
                  My Bookings
                </Link>
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

      {/* Payment Modal */}
      {paymentBooking && (
        <PaymentModal
          booking={paymentBooking}
          onClose={() => setPaymentBooking(null)}
          onPaid={handlePaymentSuccess}
        />
      )}
    </div>
  );
}