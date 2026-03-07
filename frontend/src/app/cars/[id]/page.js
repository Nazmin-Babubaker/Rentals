import Link from 'next/link';
import { notFound } from 'next/navigation';
import BookingForm from '@/components/BookingForm';

async function getCarDetails(id) {
  try {
    const res = await fetch(`http://localhost:5000/api/cars/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function CarDetailsPage({ params }) {
  const { id } = await params;
  const car = await getCarDetails(id);

  if (!car) {
    notFound();
  }

  return (
    <div className="flex flex-col w-full bg-white text-black font-sans pt-12">
      {/* Navigation Breadcrumb */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-b border-gray-200">
        <Link href="/cars" className="text-sm font-bold tracking-widest uppercase hover:underline underline-offset-8 text-gray-400 hover:text-black transition-colors">
          ← Back to Fleet
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* Left Column - Image */}
        <div className="flex-1">
          <div className="w-full h-[500px] bg-gray-100 flex items-center justify-center relative overflow-hidden group">
             <div 
                className="absolute inset-0 bg-cover bg-center grayscale opacity-80 group-hover:opacity-100 transition-all duration-700 hover:scale-105"
                style={{ backgroundImage: `url(${car.images?.[0] || 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=800'})` }}
              ></div>
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="flex flex-col justify-center">
          <p className="text-gray-500 text-sm mb-4 uppercase tracking-widest">{car.year} • {car.location}</p>
          <h1 className="text-6xl font-black uppercase tracking-tighter mb-8 leading-none">
            {car.brand} <br/> {car.model}
          </h1>
          
          <div className="w-full h-[2px] bg-black mb-8"></div>
          
          <p className="text-xl text-gray-600 font-light leading-relaxed mb-12">
            {car.description || 'No description available for this vehicle.'}
          </p>
          
          <div className="grid grid-cols-2 gap-8 mb-4">
             <div>
                <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Daily Rate</span>
                <span className="text-4xl font-black font-mono">${car.pricePerDay}</span>
             </div>
             <div>
                <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Availability</span>
                <span className={`text-xl font-bold uppercase tracking-widest mt-2 block ${car.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                  {car.isAvailable ? 'Available Now' : 'Currently Rented'}
                </span>
             </div>
          </div>

          {car.isAvailable ? (
            <BookingForm carId={car._id} pricePerDay={car.pricePerDay} />
          ) : (
            <div className="bg-gray-50 border border-gray-200 p-8 mt-12 text-center text-gray-500 text-sm font-bold uppercase tracking-widest">
              Vehicle is not available for reservation at this time.
            </div>
          )}
        </div>

      </div>

      {/* Specifications Grid */}
      <section className="w-full bg-gray-50 py-24 mt-20 border-t border-gray-200">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-black tracking-tighter uppercase mb-16 text-center">Specifications</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
               <div className="border border-gray-200 bg-white p-8 text-center flex flex-col items-center justify-center">
                  <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Transmission</span>
                  <span className="text-xl font-black uppercase">{car.transmission}</span>
               </div>
               <div className="border border-gray-200 bg-white p-8 text-center flex flex-col items-center justify-center">
                  <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Seating</span>
                  <span className="text-xl font-black uppercase">{car.seats} Adults</span>
               </div>
               <div className="border border-gray-200 bg-white p-8 text-center flex flex-col items-center justify-center">
                  <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Fuel Type</span>
                  <span className="text-xl font-black uppercase">{car.fuelType}</span>
               </div>
               <div className="border border-gray-200 bg-white p-8 text-center flex flex-col items-center justify-center">
                  <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Location</span>
                  <span className="text-xl font-black uppercase">{car.location}</span>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
}
