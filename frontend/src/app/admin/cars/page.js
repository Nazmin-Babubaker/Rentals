"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

const API = process.env.NEXT_PUBLIC_API_URL ;

export default function AdminCarsPage() {
  const [cars, setCars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { token } = useAuth();

  const [formData, setFormData] = useState({
    brand: '', model: '', year: new Date().getFullYear(), pricePerDay: '',
    transmission: 'Automatic', fuelType: 'Electric', seats: 4,
    images: [], isAvailable: true, description: '', location: ''
  });

  const fetchCars = async () => {
    try {
      const res = await fetch(`${API}/api/cars?all=true`);
      if (!res.ok) throw new Error('Failed to fetch cars');
      setCars(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchCars(); }, []);

  const resetForm = () => setFormData({
    brand: '', model: '', year: new Date().getFullYear(), pricePerDay: '',
    transmission: 'Automatic', fuelType: 'Electric', seats: 4,
    images: [], isAvailable: true, description: '', location: ''
  });

  const handleCreateCar = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/api/cars`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) return alert(data.message || 'Failed to create car');
      setIsAdding(false);
      resetForm();
      fetchCars();
    } catch {
      alert('Network error');
    } finally {
      setSubmitting(false);
    }
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('image', file);
    setUploadingImage(true);
    try {
      const res = await fetch(`${API}/api/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) return alert(data.message || 'Upload failed');
      setFormData(prev => ({ ...prev, images: [...prev.images, `${API}${data.image}`] }));
    } catch {
      alert('Upload error');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this vehicle?')) return;
    try {
      const res = await fetch(`${API}/api/cars/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) fetchCars();
    } catch { alert('Error deleting car'); }
  };

  const handleToggleAvailability = async (id, currentStatus) => {
    try {
      const res = await fetch(`${API}/api/cars/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ isAvailable: !currentStatus }),
      });
      if (res.ok) fetchCars();
    } catch { alert('Error updating car'); }
  };

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin" />
    </div>
  );

  if (error) return <div className="text-red-500 font-bold p-4">{error}</div>;

  const field = "px-4 py-3 border border-gray-300 focus:outline-none focus:border-black w-full bg-white";

  return (
    <div className="max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">Manage Fleet</h1>
          <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">{cars.length} vehicles total</p>
        </div>
        <button
          onClick={() => { setIsAdding(!isAdding); resetForm(); }}
          className="text-xs font-bold uppercase tracking-widest text-white bg-black px-6 py-3 hover:bg-gray-800 transition-colors"
        >
          {isAdding ? 'Cancel' : '+ Add Vehicle'}
        </button>
      </div>

      {/* Add Car Form */}
      {isAdding && (
        <div className="bg-gray-50 border border-gray-200 p-8 mb-8">
          <h2 className="text-sm font-bold tracking-widest uppercase text-gray-500 mb-6">New Vehicle Details</h2>
          <form onSubmit={handleCreateCar} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Brand (e.g. Porsche)" required value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} className={field} />
              <input type="text" placeholder="Model (e.g. 911)" required value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} className={field} />
              <input type="number" placeholder="Year" required value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} className={field} />
              <input type="number" placeholder="Daily Rate ($)" required value={formData.pricePerDay} onChange={e => setFormData({...formData, pricePerDay: e.target.value})} className={field} />
              <select value={formData.transmission} onChange={e => setFormData({...formData, transmission: e.target.value})} className={field}>
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
              </select>
              <select value={formData.fuelType} onChange={e => setFormData({...formData, fuelType: e.target.value})} className={field}>
                <option value="Electric">Electric</option>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Hybrid">Hybrid</option>
              </select>
              <input type="number" placeholder="Seats" required value={formData.seats} onChange={e => setFormData({...formData, seats: e.target.value})} className={field} />
              <input type="text" placeholder="Location" required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className={field} />
            </div>

            <textarea placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className={`${field} min-h-[100px]`} />

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Upload Image</label>
              <input type="file" accept="image/*" onChange={uploadFileHandler} className="w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:border-0 file:text-xs file:font-bold file:uppercase file:tracking-widest file:bg-black file:text-white hover:file:bg-gray-800 transition-colors cursor-pointer" />
              {uploadingImage && <p className="text-xs text-gray-400 mt-2 uppercase tracking-widest">Uploading…</p>}
              {formData.images.length > 0 && (
                <div className="mt-4 flex gap-3 flex-wrap">
                  {formData.images.map((img, i) => (
                    <div key={i} className="relative group">
                      <img src={img} alt="" className="w-24 h-16 object-cover border border-gray-200" />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, images: prev.images.filter((_, idx) => idx !== i) }))}
                        className="absolute top-0 right-0 bg-black text-white text-xs w-5 h-5 hidden group-hover:flex items-center justify-center"
                      >×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={uploadingImage || submitting}
              className="w-full text-xs font-bold uppercase tracking-widest text-white bg-black px-6 py-4 hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {submitting ? 'Saving…' : 'Save Vehicle to Fleet'}
            </button>
          </form>
        </div>
      )}

      {/* Cars Table */}
      <div className="bg-white border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500">Vehicle</th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500">Location</th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500">Rate/Day</th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500">Status</th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cars.map(car => (
              <tr key={car._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="p-4 font-medium flex items-center gap-3">
                  {car.images?.length > 0
                    ? <img src={car.images[0]} alt={car.model} className="w-14 h-10 object-cover rounded shrink-0" />
                    : <div className="w-14 h-10 bg-gray-100 rounded shrink-0" />
                  }
                  <div>
                    <div className="font-bold">{car.brand} {car.model}</div>
                    <div className="text-xs text-gray-400">{car.year} · {car.transmission} · {car.fuelType}</div>
                  </div>
                </td>
                <td className="p-4 text-sm text-gray-500">{car.location}</td>
                <td className="p-4 font-black">${car.pricePerDay}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs font-bold uppercase tracking-wider ${car.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {car.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                </td>
                <td className="p-4 text-right space-x-4">
                  <button
                    onClick={() => handleToggleAvailability(car._id, car.isAvailable)}
                    className="text-xs font-bold uppercase tracking-widest text-black hover:underline"
                  >
                    Toggle
                  </button>
                  <button
                    onClick={() => handleDelete(car._id)}
                    className="text-xs font-bold uppercase tracking-widest text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {cars.length === 0 && (
              <tr><td colSpan="5" className="p-10 text-center text-gray-400">No vehicles in the fleet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}