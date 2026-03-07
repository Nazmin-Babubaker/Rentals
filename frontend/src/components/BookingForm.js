"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function BookingForm({ car }) {
  const { user, token } = useAuth();
  const router = useRouter();

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('10:00');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Additional mock state for UI consistency with mockup
  const [driverAgeConfirmed, setDriverAgeConfirmed] = useState(false);

  const getLocalMinDateTime = () => {
    const tzoffset = new Date().getTimezoneOffset() * 60000;
    return new Date(Date.now() - tzoffset).toISOString().slice(0, 16);
  };

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(`${endDate}T${endTime}`);
    const diffTime = end.getTime() - start.getTime();
    if (diffTime < 0) return 0;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 0 ? 1 : diffDays;
  };

  const days = calculateDays();
  const carHireCharge = days * (car?.pricePerDay || 0);
  const protectionPlan = days > 0 ? 45.00 : 0;
  const taxesAndFees = days > 0 ? 32.50 : 0;
  const totalPrice = carHireCharge + protectionPlan + taxesAndFees;

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) {
      router.push('/login');
      return;
    }
    
    if (days < 1) {
      return setStatus({ type: 'error', message: 'Invalid date range.' });
    }

    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      // Create comprehensive start/endDate using the picked dates and times
      const fullStartDate = new Date(`${startDate}T${startTime}`).toISOString();
      const fullEndDate = new Date(`${endDate}T${endTime}`).toISOString();

      const res = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ carId: car._id, startDate: fullStartDate, endDate: fullEndDate })
      });

      const data = await res.json();
      
      if (res.ok) {
        setStatus({ type: 'success', message: 'Vehicle Reserved Successfully!' });
        setTimeout(() => router.push('/profile'), 2000);
      } else {
        setStatus({ type: 'error', message: data.message || 'Failed to reserve vehicle.' });
      }
    } catch (error) {
      console.error(error);
      setStatus({ type: 'error', message: 'An error occurred during booking.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      
      {/* Left Column - Forms */}
      <div className="flex-1 space-y-6 w-full">
        
        {status.message && (
          <div className={`p-4 text-sm font-medium rounded text-center border ${status.type === 'error' ? 'bg-red-50 border-red-200 text-red-600' : 'bg-green-50 border-green-200 text-green-600'}`}>
            {status.message}
          </div>
        )}

        <form id="booking-form" onSubmit={handleBooking} className="space-y-6">
          
          {/* Rental Dates Card */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="flex items-center text-lg font-bold text-gray-900 mb-6">
              <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Rental Dates
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {/* Pick-Up */}
               <div className="space-y-4">
                 <h4 className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">Pick-Up</h4>
                 
                 <div className="space-y-1">
                   <label className="text-sm font-medium text-gray-700">Date</label>
                   <input 
                     type="date" 
                     required 
                     value={startDate} 
                     onChange={e => setStartDate(e.target.value)} 
                     className="w-full px-4 py-2 bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm" 
                   />
                 </div>
                 
                 <div className="space-y-1">
                   <label className="text-sm font-medium text-gray-700">Time</label>
                   <input 
                     type="time" 
                     required 
                     value={startTime} 
                     onChange={e => setStartTime(e.target.value)} 
                     className="w-full px-4 py-2 bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm" 
                   />
                 </div>
                 
                 <div className="space-y-1">
                   <label className="text-sm font-medium text-gray-700">Location</label>
                   <input 
                     type="text" 
                     readOnly
                     value={car?.location || "LAX Airport"} 
                     className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded focus:outline-none text-gray-500 text-sm cursor-not-allowed" 
                   />
                 </div>
               </div>
               
               {/* Return */}
               <div className="space-y-4">
                 <h4 className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">Return</h4>
                 
                 <div className="space-y-1">
                   <label className="text-sm font-medium text-gray-700">Date</label>
                   <input 
                     type="date" 
                     required 
                     min={startDate}
                     value={endDate} 
                     onChange={e => setEndDate(e.target.value)} 
                     className="w-full px-4 py-2 bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm" 
                   />
                 </div>
                 
                 <div className="space-y-1">
                   <label className="text-sm font-medium text-gray-700">Time</label>
                   <input 
                     type="time" 
                     required 
                     value={endTime} 
                     onChange={e => setEndTime(e.target.value)} 
                     className="w-full px-4 py-2 bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm" 
                   />
                 </div>
                 
                 <div className="space-y-1">
                   <label className="text-sm font-medium text-gray-700">Location</label>
                   <input 
                     type="text" 
                     readOnly
                     value="Same as pick-up"
                     className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded focus:outline-none text-gray-500 text-sm cursor-not-allowed" 
                   />
                 </div>
               </div>
            </div>
          </div>

          {/* Driver Details Card */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="flex items-center text-lg font-bold text-gray-900 mb-6">
              <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Driver Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6">
               <div className="space-y-1">
                 <label className="text-sm font-medium text-gray-700">First Name</label>
                 <input type="text" className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-slate-900 transition-colors text-sm" />
               </div>
               <div className="space-y-1">
                 <label className="text-sm font-medium text-gray-700">Last Name</label>
                 <input type="text" className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-slate-900 transition-colors text-sm" />
               </div>
               <div className="space-y-1 col-span-1 md:col-span-2">
                 <label className="text-sm font-medium text-gray-700">Email Address</label>
                 <input type="email" defaultValue={user?.email || ''} className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-slate-900 transition-colors text-sm" />
               </div>
               <div className="space-y-1 col-span-1 md:col-span-2">
                 <label className="text-sm font-medium text-gray-700">Phone Number</label>
                 <input type="tel" className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-slate-900 transition-colors text-sm" />
               </div>
            </div>
            
            <label className="flex items-center space-x-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={driverAgeConfirmed}
                onChange={e => setDriverAgeConfirmed(e.target.checked)}
                className="w-4 h-4 text-slate-900 border-gray-300 rounded focus:ring-slate-900" 
              />
              <span className="text-sm text-gray-600">I confirm that the driver is over 25 years old and holds a valid driving license.</span>
            </label>
          </div>

          {/* Payment Method Card (Disabled styling per mockup Step 3) */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-6 pb-4 flex justify-between items-center border-b border-gray-100">
               <h3 className="flex items-center text-lg font-bold text-gray-500">
                 <svg className="w-5 h-5 mr-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                 </svg>
                 Payment Method
               </h3>
               <span className="bg-gray-100 text-gray-500 text-xs font-bold px-3 py-1 rounded">Step 3</span>
            </div>
            <div className="p-6">
              <div className="w-full p-4 bg-gray-50 border border-gray-200 rounded text-center text-gray-400 text-sm italic">
                Payment details will be entered on the next step
              </div>
            </div>
          </div>
          
        </form>
      </div>

      {/* Right Column - Summary */}
      <div className="w-full lg:w-[400px] flex-shrink-0">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm sticky top-24">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Booking Summary</h2>
          
          <div className="w-full h-40 bg-gray-100 rounded-lg mb-6 flex items-center justify-center relative shadow-inner">
             <div 
                className="absolute inset-0 bg-contain bg-center bg-no-repeat m-4 mix-blend-multiply opacity-80"
                style={{ backgroundImage: `url(${car?.images?.[0] || 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=800'})` }}
              ></div>
              {!car?.images?.[0] && (
                 <svg className="w-12 h-12 text-gray-300 opacity-50 z-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                 </svg>
              )}
          </div>

          <div className="flex justify-between items-start mb-1">
             <h3 className="text-lg font-bold text-gray-900">{car?.brand} {car?.model}</h3>
             <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
               {car?.fuelType === 'Electric' ? 'Electric' : 'Standard'}
             </span>
          </div>
          <p className="text-xs text-gray-500 mb-4">or similar {car?.fuelType === 'Electric' ? 'electric sedan' : 'premium vehicle'}</p>
          
          <div className="flex items-center space-x-4 mb-6 text-xs text-gray-600">
             <span className="flex items-center"><svg className="w-3.5 h-3.5 mr-1.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>{car?.seats || 5} Seats</span>
             <span className="flex items-center"><svg className="w-3.5 h-3.5 mr-1.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>2 Bags</span>
             <span className="flex items-center capitalize"><svg className="w-3.5 h-3.5 mr-1.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>{car?.transmission === 'automatic' || !car?.transmission ? 'Auto' : 'Manual'}</span>
          </div>
          
          <div className="border-t border-gray-100 my-6"></div>
          
          <div className="space-y-3 mb-6">
             <div className="flex justify-between text-sm">
                <span className="text-gray-600">Car hire charge ({days} days)</span>
                <span className="text-gray-900 font-medium">${carHireCharge.toFixed(2)}</span>
             </div>
             <div className="flex justify-between text-sm">
                <span className="text-gray-600">Protection plan</span>
                <span className="text-gray-900 font-medium">${protectionPlan.toFixed(2)}</span>
             </div>
             <div className="flex justify-between text-sm">
                <span className="text-gray-600">Taxes & Fees</span>
                <span className="text-gray-900 font-medium">${taxesAndFees.toFixed(2)}</span>
             </div>
          </div>
          
          <div className="border-t border-gray-100 my-6"></div>
          
          <div className="flex justify-between items-center mb-8">
             <span className="text-base font-bold text-gray-900">Total Price</span>
             <span className="text-2xl font-bold text-gray-900">${totalPrice.toFixed(2)}</span>
          </div>

          <button 
            type="submit" 
            form="booking-form"
            disabled={isSubmitting || days < 1}
            className="w-full py-3.5 bg-[#1e2329] text-white text-sm font-semibold rounded hover:bg-black transition-colors shadow-sm disabled:bg-gray-400 flex justify-center items-center"
          >
            {isSubmitting ? 'Confirming...' : user ? 'Confirm Booking \u2192' : 'Log in to Reserve'}
          </button>
          
          <p className="text-center text-[10px] text-gray-500 mt-4">
            Free cancellation up to 48 hours before pick-up.
          </p>
        </div>
      </div>
      
    </div>
  );
}
