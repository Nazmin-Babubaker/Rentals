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
    <div className="flex flex-col w-full bg-[#f8f9fa] text-black font-sans min-h-screen pt-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
         
         {/* Top Wizard Steps Indicator */}
         <div className="flex justify-center items-center py-8 mb-4">
            <div className="flex items-center space-x-4">
               <div className="flex items-center space-x-2">
                 <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold">1</div>
                 <span className="text-xs font-semibold text-slate-900">Selection</span>
               </div>
               
               <div className="w-8 h-[2px] bg-slate-900"></div>
               
               <div className="flex items-center space-x-2">
                 <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold">2</div>
                 <span className="text-xs font-semibold text-slate-900">Booking Details</span>
               </div>
               
               <div className="w-8 h-[2px] bg-gray-300"></div>

               <div className="flex items-center space-x-2">
                 <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-[10px] font-bold">3</div>
                 <span className="text-xs font-semibold text-gray-400">Confirmation</span>
               </div>
            </div>
         </div>

         {car.isAvailable ? (
            <BookingForm car={car} />
         ) : (
            <div className="bg-white border border-gray-200 rounded-xl p-12 text-center shadow-sm">
               <p className="text-gray-500 font-medium">Vehicle is not available for reservation at this time.</p>
               <Link href="/cars" className="inline-block mt-4 px-6 py-2 bg-slate-900 text-white text-sm font-semibold rounded hover:bg-black transition-colors">
                 Back to Fleet
               </Link>
            </div>
         )}
         
      </div>
    </div>
  );
}
