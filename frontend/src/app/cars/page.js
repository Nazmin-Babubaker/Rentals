import Link from 'next/link';
import Image from 'next/image';

async function getCars() {
  try {
    const res = await fetch('http://localhost:5000/api/cars', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function CarsPage() {
  const fleet = await getCars();

  return (
    <div className="flex flex-col w-full bg-white text-black font-sans min-h-screen">
      
      {/* Search Header Section */}
      <section className="w-full bg-[#f8f9fa] pt-12 pb-12 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-mono text-center font-bold tracking-widest uppercase mb-10 text-gray-800">
            Find Your Vehicle
          </h1>
          
          {/* Search Bar */}
          <div className="bg-white border border-gray-300 p-4 shadow-sm flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 absolute -top-2.5 left-2 bg-white px-1">Location</label>
              <div className="flex items-center border border-gray-300 px-3 py-2.5">
                <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <input type="text" placeholder="City, Airport, or Address" className="w-full focus:outline-none text-sm text-gray-700" />
              </div>
            </div>
            
            <div className="flex-1 relative">
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 absolute -top-2.5 left-2 bg-white px-1">Pick-up Date</label>
              <div className="flex items-center border border-gray-300 px-3 py-2.5">
                <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <input type="text" placeholder="Select Date" className="w-full focus:outline-none text-sm text-gray-700" />
              </div>
            </div>

            <div className="flex-1 relative">
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 absolute -top-2.5 left-2 bg-white px-1">Drop-off Date</label>
              <div className="flex items-center border border-gray-300 px-3 py-2.5">
                <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <input type="text" placeholder="Select Date" className="w-full focus:outline-none text-sm text-gray-700" />
              </div>
            </div>

            <button className="bg-[#2D333B] hover:bg-black text-white px-8 py-2.5 font-bold text-sm tracking-widest flex items-center justify-center transition-colors">
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              SEARCH
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col lg:flex-row gap-8">
        
        {/* Left Sidebar (Filters) */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="border border-gray-200 p-6 bg-white">
            <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-2">
              <h3 className="font-mono font-bold tracking-widest text-sm text-gray-900">FILTERS</h3>
              <button className="text-[10px] underline text-gray-500 hover:text-gray-900 uppercase">Reset</button>
            </div>

            {/* Price Range */}
            <div className="mb-8">
              <h4 className="text-[10px] font-bold tracking-widest text-gray-900 mb-4">PRICE RANGE</h4>
              <div className="h-2 bg-gray-200 rounded-full mb-3 relative">
                <div className="absolute left-0 top-0 h-full bg-[#404b5c] w-3/4 rounded-full"></div>
                <div className="absolute left-3/4 -top-1.5 w-5 h-5 bg-white border-2 border-[#404b5c] rounded-full shadow cursor-pointer"></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 font-semibold">
                <span>$30</span>
                <span>$500+</span>
              </div>
            </div>

            {/* Car Type */}
            <div className="mb-8">
              <h4 className="text-[10px] font-bold tracking-widest text-gray-900 mb-4">CAR TYPE</h4>
              <div className="space-y-3">
                {['Economy (12)', 'SUV (8)', 'Luxury (4)', 'Convertible (2)'].map((type, i) => (
                  <label key={i} className="flex items-center space-x-3 cursor-pointer group">
                    <div className={`w-4 h-4 border flex items-center justify-center ${i === 1 ? 'bg-[#2D333B] border-[#2D333B]' : 'border-gray-300 bg-white group-hover:border-gray-400'}`}>
                      {i === 1 && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
                    </div>
                    <span className="text-xs text-gray-600 font-medium">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Fuel Type */}
            <div className="mb-8">
              <h4 className="text-[10px] font-bold tracking-widest text-gray-900 mb-4">FUEL</h4>
              <div className="space-y-3">
                {['Gasoline', 'Hybrid', 'Electric'].map((type, i) => (
                  <label key={i} className="flex items-center space-x-3 cursor-pointer group">
                    <div className="w-4 h-4 border border-gray-300 bg-white flex items-center justify-center group-hover:border-gray-400"></div>
                    <span className="text-xs text-gray-600 font-medium">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Seats */}
            <div>
              <h4 className="text-[10px] font-bold tracking-widest text-gray-900 mb-4">SEATS</h4>
              <div className="flex space-x-2">
                {['2', '4', '5', '7+'].map((seat, i) => (
                  <button key={i} className={`w-8 h-8 flex items-center justify-center text-xs font-semibold border ${i === 1 ? 'bg-[#2D333B] text-white border-[#2D333B]' : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'}`}>
                    {seat}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Right Content */}
        <div className="flex-1">
          
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-mono font-bold tracking-widest text-gray-900 uppercase">
              {fleet.length} CARS AVAILABLE
            </h2>
            <div className="flex items-center text-xs text-gray-500 space-x-2">
              <span>Sort by:</span>
              <select className="border border-gray-300 px-2 py-1 text-gray-700 font-medium focus:outline-none focus:border-gray-500">
                <option>Recommended</option>
                <option>Price (Low to High)</option>
                <option>Price (High to Low)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fleet.map((car) => {
              // Guess category basic logc
              let category = 'ECONOMY';
              if(car.pricePerDay > 70) category = 'LUXURY';
              if(car.model.toLowerCase().includes('rav4') || car.model.toLowerCase().includes('suv')) category = 'SUV';

              return (
                <div key={car._id} className="bg-white border border-gray-200 flex flex-col overflow-hidden hover:shadow-md transition-shadow">
                  {/* Image Container */}
                  <div className="h-40 w-full bg-gray-100 flex items-center justify-center relative p-4 group">
                    <div className="absolute top-3 right-3 bg-white border border-gray-200 px-2 pt-[1px] pb-[1px] text-[9px] font-bold tracking-widest text-gray-600 uppercase shadow-sm z-10">
                      {category}
                    </div>
                    {/* Fallback to simple icon if no image to match mockup feel, otherwise use image nicely */}
                    <div 
                      className="absolute inset-0 bg-contain bg-center bg-no-repeat m-4 mix-blend-multiply opacity-80 group-hover:scale-105 transition-transform duration-500"
                      style={{ backgroundImage: `url(${car.images?.[0] || 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=800'})` }}
                    ></div>
                    {/* Grid pattern background placeholder to simulate missing / alpha image like mockup */}
                    {!car.images?.[0] && (
                       <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiAvPgo8cGF0aCBkPSJNMCAwTDggOFpNOCAwTDAgOFoiIHN0cm9rZT0iI2U1ZTdlYiIgc3Ryb2tlLXdpZHRoPSIwLjUiIC8+Cjwvc3ZnPg==')] opacity-50 z-0"></div>
                    )}
                  </div>
                  
                  {/* Details Container */}
                  <div className="p-5 flex-1 flex flex-col border-t border-gray-100">
                    <h3 className="text-base font-bold text-gray-900 mb-0.5">{car.brand} {car.model}</h3>
                    <p className="text-[10px] text-gray-400 font-bold mb-4">OR SIMILAR</p>
                    
                    <div className="flex items-center space-x-4 mb-4 text-xs font-medium text-gray-500">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        {car.seats} Seats
                      </div>
                      <div className="flex items-center capitalize">
                        <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        {car.fuelType}
                      </div>
                      <div className="flex items-center capitalize">
                        <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                        {car.transmission === 'automatic' || !car.transmission ? 'Auto' : 'Manual'}
                      </div>
                    </div>
                    
                    <div className="w-full h-px bg-gray-100 mb-4 mt-auto"></div>
                    
                    <div className="flex justify-between items-end">
                      <div>
                        <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Daily Rate</span>
                        <span className="text-xl font-bold text-gray-900">${car.pricePerDay}</span>
                      </div>
                      <Link href={`/cars/${car._id}`} className="bg-[#2D333B] hover:bg-black text-white px-5 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors">
                        Book Now
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          <div className="mt-12 flex justify-center pb-8">
            <div className="flex space-x-2">
              <button className="w-8 h-8 flex items-center justify-center border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-900 text-sm font-semibold rounded-sm shadow-sm transition-colors">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button className="w-8 h-8 flex items-center justify-center border border-[#2D333B] bg-[#2D333B] text-white text-sm font-semibold rounded-sm shadow-sm">1</button>
              <button className="w-8 h-8 flex items-center justify-center border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 text-sm font-semibold rounded-sm shadow-sm transition-colors">2</button>
              <button className="w-8 h-8 flex items-center justify-center border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 text-sm font-semibold rounded-sm shadow-sm transition-colors">3</button>
              <button className="w-8 h-8 flex items-center justify-center border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-900 text-sm font-semibold rounded-sm shadow-sm transition-colors">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>

        </div>

      </section>
    </div>
  );
}
