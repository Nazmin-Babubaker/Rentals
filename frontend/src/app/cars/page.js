import Link from 'next/link';
import Image from 'next/image';

// Placeholder data for our vehicle fleet
const fleet = [
  { id: 1, name: "Model 01", category: "Premium Series", price: 180, image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=800" },
  { id: 2, name: "Model 02", category: "Sport Edition", price: 220, image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800" },
  { id: 3, name: "Model 03", category: "Executive SUV", price: 250, image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&q=80&w=800" },
  { id: 4, name: "Model 04", category: "Premium Series", price: 190, image: "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?auto=format&fit=crop&q=80&w=800" },
  { id: 5, name: "Model 05", category: "Electric", price: 160, image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=800" },
  { id: 6, name: "Model 06", category: "Grand Tourer", price: 300, image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&q=80&w=800" },
];

export default function CarsPage() {
  return (
    <div className="flex flex-col w-full bg-white text-black font-sans pt-12">
      {/* Header Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-b border-gray-200">
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6">
          The Fleet
        </h1>
        <p className="text-xl text-gray-500 font-light max-w-2xl">
          Our entire collection of meticulously maintained, premium vehicles. Filtered for performance, design, and pure driving experience.
        </p>
      </section>

      {/* Grid Section */}
      <section className="w-full bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {fleet.map((car) => (
              <div key={car.id} className="group bg-white p-6 border border-gray-200 hover:border-black transition-colors duration-300 flex flex-col h-full">
                <div className="h-64 w-full bg-gray-100 mb-8 relative overflow-hidden flex items-center justify-center">
                  <div 
                    className="absolute inset-0 bg-cover bg-center grayscale opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                    style={{ backgroundImage: `url(${car.image})` }}
                  ></div>
                </div>
                
                <h3 className="text-2xl font-black uppercase tracking-tight mb-1">{car.name}</h3>
                <p className="text-gray-500 text-sm mb-6 uppercase tracking-wider">{car.category}</p>
                
                <div className="w-full h-[1px] bg-gray-200 mb-6"></div>
                
                <div className="flex justify-between items-end mt-auto">
                  <div className="text-left">
                    <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">D/Rate</span>
                    <span className="text-xl font-bold font-mono">${car.price}</span>
                  </div>
                  <Link href={`/cars/${car.id}`} className="text-xs font-bold uppercase tracking-widest text-black border border-black px-4 py-2 hover:bg-black hover:text-white transition-colors duration-200">
                    Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
