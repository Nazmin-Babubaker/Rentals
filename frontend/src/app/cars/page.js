"use client";

import Link from 'next/link';
import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL;

function CarsContent() {
  const searchParams = useSearchParams();
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [fleet, setFleet] = useState([]);
  const [sortedFleet, setSortedFleet] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('recommended');

  const fetchCars = useCallback(async () => {
    setLoading(true);
    try {
      const url = location.trim()
        ? `${API}/api/cars/search/location?location=${encodeURIComponent(location.trim())}`
        : `${API}/api/cars`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch cars');
      const data = await res.json();
      setFleet(data);
    } catch (error) {
      console.error(error);
      setFleet([]);
    } finally {
      setLoading(false);
    }
  }, [location]);

  useEffect(() => { fetchCars(); }, [fetchCars]);

  // Sort whenever fleet or sort option changes
  useEffect(() => {
    const copy = [...fleet];
    if (sortBy === 'price-asc') copy.sort((a, b) => a.pricePerDay - b.pricePerDay);
    else if (sortBy === 'price-desc') copy.sort((a, b) => b.pricePerDay - a.pricePerDay);
    setSortedFleet(copy);
  }, [fleet, sortBy]);

  const handleSearch = (e) => {
    e?.preventDefault();
    fetchCars();
  };

  // Derive a display category from price
  const getCategory = (car) => {
    if (car.pricePerDay > 200) return 'LUXURY';
    if (car.pricePerDay > 80) return 'PREMIUM';
    if (car.model.toLowerCase().includes('suv') || car.model.toLowerCase().includes('rav4')) return 'SUV';
    return 'ECONOMY';
  };

  // Normalise transmission display — backend stores 'Automatic'/'Manual' (capitalised)
  const getTransmission = (t) => {
    if (!t) return 'Auto';
    return t.toLowerCase().startsWith('a') ? 'Auto' : 'Manual';
  };

  return (
    <div className="flex flex-col w-full bg-white text-black font-sans min-h-screen">

      {/* Search Header */}
      <section className="w-full bg-[#f8f9fa] pt-12 pb-12 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-mono text-center font-bold tracking-widest uppercase mb-10 text-gray-800">
            Find Your Vehicle
          </h1>

          <form
            onSubmit={handleSearch}
            className="bg-white border border-gray-300 p-4 shadow-sm flex flex-col md:flex-row gap-4 max-w-3xl mx-auto"
          >
            <div className="flex-1 relative">
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 absolute -top-2.5 left-2 bg-white px-1">
                Location
              </label>
              <div className="flex items-center border border-gray-300 px-3 py-2.5">
                <svg className="w-4 h-4 text-gray-400 mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="City, Airport, or Address"
                  className="w-full focus:outline-none text-sm text-gray-700"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
                {/* Clear button */}
                {location && (
                  <button
                    type="button"
                    onClick={() => setLocation('')}
                    className="text-gray-300 hover:text-gray-600 ml-2 text-lg leading-none"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="bg-[#2D333B] hover:bg-black text-white px-8 py-2.5 font-bold text-sm tracking-widest flex items-center justify-center transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              SEARCH
            </button>
          </form>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-mono font-bold tracking-widest text-gray-900 uppercase">
            {loading ? '—' : `${sortedFleet.length} CARS AVAILABLE`}
            {location.trim() && !loading && (
              <span className="text-sm font-normal text-gray-400 normal-case ml-2">
                in &quot;{location}&quot;
              </span>
            )}
          </h2>

          {/* Functional sort — now actually sorts the list */}
          <div className="flex items-center text-xs text-gray-500 space-x-2">
            <span>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 px-2 py-1 text-gray-700 font-medium focus:outline-none focus:border-gray-500"
            >
              <option value="recommended">Recommended</option>
              <option value="price-asc">Price (Low to High)</option>
              <option value="price-desc">Price (High to Low)</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="w-full flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-[#2D333B] rounded-full animate-spin" />
          </div>
        ) : sortedFleet.length === 0 ? (
          <div className="w-full text-center py-20 bg-gray-50 border border-gray-200">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No Vehicles Found</h3>
            <p className="text-sm text-gray-500 mb-6">
              {location.trim()
                ? `No available cars in "${location}" right now.`
                : 'No cars are available at this time.'}
            </p>
            {location.trim() && (
              <button
                onClick={() => setLocation('')}
                className="text-xs font-bold uppercase tracking-widest text-white bg-[#2D333B] px-6 py-3 hover:bg-black transition-colors"
              >
                View All Cars
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedFleet.map((car) => (
              <div
                key={car._id}
                className="bg-white border border-gray-200 flex flex-col overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Image */}
                <div className="h-40 w-full bg-gray-100 flex items-center justify-center relative p-4 group">
                  <div className="absolute top-3 right-3 bg-white border border-gray-200 px-2 py-[1px] text-[9px] font-bold tracking-widest text-gray-600 uppercase shadow-sm z-10">
                    {getCategory(car)}
                  </div>
                  <div
                    className="absolute inset-0 bg-contain bg-center bg-no-repeat m-4 mix-blend-multiply opacity-80 group-hover:scale-105 transition-transform duration-500"
                    style={{
                      backgroundImage: `url(${
                        car.images?.[0] ||
                        'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=800'
                      })`
                    }}
                  />
                  {!car.images?.[0] && (
                    <div className="absolute inset-0 opacity-40 z-0"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Crect width='8' height='8' fill='%23fff'/%3E%3Cpath d='M0 0L8 8ZM8 0L0 8Z' stroke='%23e5e7eb' stroke-width='0.5'/%3E%3C/svg%3E")`
                      }}
                    />
                  )}
                </div>

                {/* Details */}
                <div className="p-5 flex-1 flex flex-col border-t border-gray-100">
                  <h3 className="text-base font-bold text-gray-900 mb-0.5">{car.brand} {car.model}</h3>
                  <p className="text-[10px] text-gray-400 font-bold mb-4 uppercase">{car.location}</p>

                  <div className="flex items-center space-x-4 mb-4 text-xs font-medium text-gray-500">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {car.seats} Seats
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      {car.fuelType}
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                      </svg>
                      {getTransmission(car.transmission)}
                    </div>
                  </div>

                  <div className="w-full h-px bg-gray-100 mb-4 mt-auto" />

                  <div className="flex justify-between items-end">
                    <div>
                      <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Daily Rate</span>
                      <span className="text-xl font-bold text-gray-900">${car.pricePerDay}</span>
                    </div>
                    <Link
                      href={`/cars/${car._id}`}
                      className="bg-[#2D333B] hover:bg-black text-white px-5 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default function CarsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-[#2D333B] rounded-full animate-spin" />
      </div>
    }>
      <CarsContent />
    </Suspense>
  );
}