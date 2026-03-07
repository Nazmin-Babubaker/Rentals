"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useAuth();

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      } else {
        setError("Failed to fetch users");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred loading users");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchUsers();
  }, [token]);

  const handleRoleToggle = async (id, currentRole) => {
    const newRole = currentRole === 'admin' ? 'customer' : 'admin';
    try {
      const res = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      });
      if (res.ok) fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const res = await fetch(`http://localhost:5000/api/users/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) fetchUsers();
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-6xl">
      <h1 className="text-3xl font-black uppercase tracking-tighter mb-8">Manage Users</h1>
      
      <div className="bg-white border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500">Name</th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500">Email</th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500">Role</th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="p-4 font-medium">{u.name}</td>
                <td className="p-4 text-gray-600">{u.email}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs font-bold uppercase tracking-wider ${u.role === 'admin' ? 'bg-black text-white' : 'bg-gray-200 text-gray-800'}`}>
                    {u.role}
                  </span>
                </td>
                <td className="p-4 text-right space-x-4">
                  <button 
                    onClick={() => handleRoleToggle(u._id, u.role)}
                    className="text-xs font-bold uppercase tracking-widest text-black hover:underline"
                  >
                    Toggle Role
                  </button>
                  <button 
                    onClick={() => handleDelete(u._id)}
                    className="text-xs font-bold uppercase tracking-widest text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="4" className="p-8 text-center text-gray-500">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
