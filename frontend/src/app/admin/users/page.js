"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

const API = process.env.NEXT_PUBLIC_API_URL ;

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [togglingId, setTogglingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const { token } = useAuth();

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch users');
      setUsers(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchUsers();
  }, [token]);

  const handleRoleToggle = async (id, currentRole) => {
    setTogglingId(id);
    const newRole = currentRole === 'admin' ? 'customer' : 'admin';
    try {
      const res = await fetch(`${API}/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) {
        // Patch local state immediately
        setUsers(prev => prev.map(u => u._id === id ? { ...u, role: newRole } : u));
      }
    } catch { alert('Error updating role'); }
    finally { setTogglingId(null); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`${API}/api/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setUsers(prev => prev.filter(u => u._id !== id));
    } catch { alert('Error deleting user'); }
    finally { setDeletingId(null); }
  };

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin" />
    </div>
  );

  if (error) return <div className="text-red-500 font-bold p-4">{error}</div>;

  const admins = users.filter(u => u.role === 'admin').length;

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-black uppercase tracking-tighter mb-1">Manage Users</h1>
        <p className="text-xs text-gray-400 uppercase tracking-widest">
          {users.length} total · {admins} admin{admins !== 1 ? 's' : ''} · {users.length - admins} customer{users.length - admins !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="bg-white border border-gray-200 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500">Name</th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500">Email</th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500">Phone</th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500">Role</th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500">Joined</th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="p-4 font-bold text-sm">{u.name}</td>
                <td className="p-4 text-sm text-gray-600">{u.email}</td>
                <td className="p-4 text-sm text-gray-400">{u.phoneNumber || '—'}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs font-bold uppercase tracking-wider ${u.role === 'admin' ? 'bg-black text-white' : 'bg-gray-100 text-gray-700'}`}>
                    {u.role}
                  </span>
                </td>
                <td className="p-4 text-xs text-gray-400">
                  {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                </td>
                <td className="p-4 text-right space-x-4">
                  <button
                    onClick={() => handleRoleToggle(u._id, u.role)}
                    disabled={togglingId === u._id}
                    className="text-xs font-bold uppercase tracking-widest text-black hover:underline disabled:opacity-50"
                  >
                    {togglingId === u._id ? '…' : u.role === 'admin' ? 'Make Customer' : 'Make Admin'}
                  </button>
                  <button
                    onClick={() => handleDelete(u._id)}
                    disabled={deletingId === u._id}
                    className="text-xs font-bold uppercase tracking-widest text-red-600 hover:underline disabled:opacity-50"
                  >
                    {deletingId === u._id ? '…' : 'Delete'}
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="6" className="p-10 text-center text-gray-400">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}