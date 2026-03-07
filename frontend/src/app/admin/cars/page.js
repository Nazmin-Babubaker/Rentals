"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function AdminCarsPage() {
  const [cars, setCars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const { token } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    brand: '', name: '', maxSpeed: '', acceleration: '',
    fuelType: 'electric', transmission: 'automatic',
    seatingCapacity: 4, images: [''], pricePerDay: '',
    isAvailable: true
  });

  const fetchCars = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/cars');
      if (res.ok) {
        const data = await res.json();
        setCars(data);
      } else {
        setError('Failed to fetch cars');
      }
    } catch (err) {
      console.error(err);
      setError('Error connecting to backend');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleCreateCar = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/cars', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsAdding(false);
        setFormData({
          brand: '', name: '', maxSpeed: '', acceleration: '',
          fuelType: 'electric', transmission: 'automatic',
          seatingCapacity: 4, images: [''], pricePerDay: '',
          isAvailable: true
        });
        fetchCars();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this vehicle?")) {
      try {
        const res = await fetch(`http://localhost:5000/api/cars/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) fetchCars();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleToggleAvailability = async (id, currentStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/cars/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isAvailable: !currentStatus })
      });
      if (res.ok) fetchCars();
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black uppercase tracking-tighter">Manage Fleet</h1>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="text-xs font-bold uppercase tracking-widest text-white bg-black px-6 py-3 hover:bg-gray-800 transition-colors"
        >
          {isAdding ? 'Cancel' : 'Add New Vehicle'}
        </button>
      </div>

      {isAdding && (
        <div className="bg-gray-50 border border-gray-200 p-8 mb-8">
          <h2 className="text-sm font-bold tracking-widest uppercase text-gray-500 mb-6">Vehicle Details</h2>
          <form onSubmit={handleCreateCar} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input type="text" placeholder="Brand (e.g., Porsche)" required value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} className="px-4 py-3 border border-gray-300 focus:outline-none focus:border-black" />
              <input type="text" placeholder="Model Name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="px-4 py-3 border border-gray-300 focus:outline-none focus:border-black" />
              <input type="number" placeholder="Daily Rate ($)" required value={formData.pricePerDay} onChange={e => setFormData({...formData, pricePerDay: e.target.value})} className="px-4 py-3 border border-gray-300 focus:outline-none focus:border-black" />
              <input type="number" placeholder="Max Speed (mph)" value={formData.maxSpeed} onChange={e => setFormData({...formData, maxSpeed: e.target.value})} className="px-4 py-3 border border-gray-300 focus:outline-none focus:border-black" />
              <input type="number" placeholder="0-60 mph (sec)" value={formData.acceleration} onChange={e => setFormData({...formData, acceleration: e.target.value})} className="px-4 py-3 border border-gray-300 focus:outline-none focus:border-black" />
              <input type="text" placeholder="Image URL" value={formData.images[0]} onChange={e => setFormData({...formData, images: [e.target.value]})} className="px-4 py-3 border border-gray-300 focus:outline-none focus:border-black" />
            </div>
            
            <button type="submit" className="w-full text-xs font-bold uppercase tracking-widest text-white bg-black px-6 py-4 hover:bg-gray-800 transition-colors">
              Save Vehicle to Fleet
            </button>
          </form>
        </div>
      )}

      <div className="bg-white border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500">Vehicle</th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500">Rate/Day</th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500">Status</th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car) => (
              <tr key={car._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="p-4 font-medium">{car.brand} {car.name}</td>
                <td className="p-4 text-gray-600">${car.pricePerDay}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs font-bold uppercase tracking-wider ${car.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {car.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                </td>
                <td className="p-4 text-right space-x-4">
                  <button onClick={() => handleToggleAvailability(car._id, car.isAvailable)} className="text-xs font-bold uppercase tracking-widest text-black hover:underline">
                    Toggle Status
                  </button>
                  <button onClick={() => handleDelete(car._id)} className="text-xs font-bold uppercase tracking-widest text-red-600 hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {cars.length === 0 && (
              <tr><td colSpan="4" className="p-8 text-center text-gray-500">No vehicles in the fleet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
