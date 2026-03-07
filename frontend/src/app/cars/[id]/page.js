import Link from 'next/link';
import { notFound } from 'next/navigation';

// Placeholder data for our vehicle fleet
const fleet = [
  { id: 1, name: "Model 01", category: "Premium Series", price: 180, image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=800", description: "The Model 01 is our flagship premium vehicle, designed to offer unparalleled comfort and a silent, smooth driving experience. Perfect for both city driving and long highway stretches." },
  { id: 2, name: "Model 02", category: "Sport Edition", price: 220, image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800", description: "Engineered for pure performance, the Model 02 offers agile handling and aggressive acceleration. Experience driving the way it was meant to be experienced." },
  { id: 3, name: "Model 03", category: "Executive SUV", price: 250, image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&q=80&w=800", description: "Space, power, and prestige. The Model 03 is an executive SUV that commands attention while providing maximum interior volume for passengers and cargo." },
  { id: 4, name: "Model 04", category: "Premium Series", price: 190, image: "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?auto=format&fit=crop&q=80&w=800", description: "Our refined sedan designed specifically for executive transit and minimalist aesthetic appreciation. Elegant lines, understated presence." },
  { id: 5, name: "Model 05", category: "Electric", price: 160, image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=800", description: "The silent revolution. A fully electric vehicle providing instant torque, zero emissions, and a completely reinvented driver interface." },
  { id: 6, name: "Model 06", category: "Grand Tourer", price: 300, image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&q=80&w=800", description: "For the cross-country enthusiast. The Model 06 combines sports car mechanics with luxury sedan comfort for effortless inter-city travel." },
];

export default async function CarDetailsPage({ params }) {
  // In Next.js 15+ App Router, `params` should be awaited
  const { id } = await params;
  
  // Find the car in our placeholder data
  const car = fleet.find(c => c.id.toString() === id);

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
                className="absolute inset-0 bg-cover bg-center grayscale opacity-80 group-hover:opacity-100 transition-all duration-700"
                style={{ backgroundImage: `url(${car.image})` }}
              ></div>
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="flex flex-col justify-center">
          <p className="text-gray-500 text-sm mb-4 uppercase tracking-widest">{car.category}</p>
          <h1 className="text-6xl font-black uppercase tracking-tighter mb-8 leading-none">
            {car.name}
          </h1>
          
          <div className="w-full h-[2px] bg-black mb-8"></div>
          
          <p className="text-xl text-gray-600 font-light leading-relaxed mb-12">
            {car.description}
          </p>
          
          <div className="grid grid-cols-2 gap-8 mb-12">
             <div>
                <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Daily Rate</span>
                <span className="text-4xl font-black font-mono">${car.price}</span>
             </div>
             <div>
                <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Availability</span>
                <span className="text-xl font-bold uppercase tracking-widest text-green-600 mt-2 block">Available Now</span>
             </div>
          </div>

          <div className="flex gap-4">
             <button className="flex-1 py-5 text-sm font-bold tracking-widest uppercase text-white bg-black hover:bg-gray-800 transition-colors duration-300">
               Reserve Vehicle
             </button>
          </div>
        </div>

      </div>

      {/* Specifications Grid */}
      <section className="w-full bg-gray-50 py-24 mt-20 border-t border-gray-200">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-black tracking-tighter uppercase mb-16 text-center">Specifications</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
               <div className="border border-gray-200 bg-white p-8 text-center flex flex-col items-center justify-center">
                  <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Transmission</span>
                  <span className="text-xl font-black uppercase">Auto</span>
               </div>
               <div className="border border-gray-200 bg-white p-8 text-center flex flex-col items-center justify-center">
                  <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Seating</span>
                  <span className="text-xl font-black uppercase">4 Adults</span>
               </div>
               <div className="border border-gray-200 bg-white p-8 text-center flex flex-col items-center justify-center">
                  <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Drivetrain</span>
                  <span className="text-xl font-black uppercase">AWD</span>
               </div>
               <div className="border border-gray-200 bg-white p-8 text-center flex flex-col items-center justify-center">
                  <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">0-60 MPH</span>
                  <span className="text-xl font-black uppercase">4.2s</span>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
}
