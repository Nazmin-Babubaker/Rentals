import Link from 'next/link';
import Image from 'next/image';

async function getFeaturedCars() {
  try {
    const res = await fetch('http://localhost:5000/api/cars', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function Home() {
  const allCars = await getFeaturedCars();
  const featuredCars = allCars.slice(0, 3);

  return (
    <div className="flex flex-col w-full bg-white text-black font-sans">
      {/* Hero Section */}
      <section className="relative w-full h-[80vh] min-h-[600px] flex items-center justify-center bg-black overflow-hidden selection:bg-white selection:text-black">
        {/* Grayscale Car background image */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-50 grayscale transition-transform duration-[20s] hover:scale-105"></div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
          <div className="max-w-3xl">
            <h1 className="text-6xl sm:text-7xl md:text-8xl font-black text-white tracking-tighter leading-none mb-8 uppercase">
              Drive<br />Differently
            </h1>
            <p className="mt-4 text-xl sm:text-2xl text-gray-300 font-light mb-12 max-w-xl">
              Curated vehicles for those who appreciate pure design and minimal aesthetics. Experience the road, nothing else.
            </p>
            <div className="flex gap-6 flex-col sm:flex-row">
              <Link href="/cars" className="px-10 py-4 text-sm font-bold tracking-widest uppercase text-black bg-white border-2 border-white hover:bg-black hover:text-white transition-colors duration-300 inline-flex justify-center items-center">
                Explore Fleet
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="w-full bg-white py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter uppercase mb-8">Less Noise. More Drive.</h2>
          <p className="max-w-3xl mx-auto text-xl text-gray-600 font-light leading-relaxed">
            We stripped away the complicated paperwork, the hidden fees, and the unnecessary up-sells. What&apos;s left is a pure, seamless connection between you and the machine.
          </p>
          <div className="w-24 h-1 bg-black mx-auto mt-16 mb-8"></div>
        </div>
      </section>

      {/* Featured Fleet Section */}
      <section className="w-full bg-gray-50 py-32 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-16">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase">
              The Collection
            </h2>
            <Link href="/cars" className="text-sm font-bold tracking-widest uppercase hover:underline underline-offset-8 hidden sm:block">
              View All ↗
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {featuredCars.map((car) => (
              <div key={car._id} className="group bg-white p-6 border border-gray-200 hover:border-black transition-colors duration-300 flex flex-col h-full">
                <div className="h-64 w-full bg-gray-100 mb-8 relative overflow-hidden flex items-center justify-center">
                  <div 
                    className="absolute inset-0 bg-cover bg-center grayscale opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                    style={{ backgroundImage: `url(${car.images?.[0] || 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=800'})` }}
                  ></div>
                </div>
                
                <h3 className="text-2xl font-black uppercase tracking-tight mb-1">{car.brand} {car.model}</h3>
                <p className="text-gray-500 text-sm mb-6 uppercase tracking-wider">{car.year} • {car.fuelType}</p>
                
                <div className="w-full h-[1px] bg-gray-200 mb-6"></div>
                
                <div className="flex justify-between items-end mt-auto">
                  <div className="text-left">
                    <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">D/Rate</span>
                    <span className="text-xl font-bold font-mono">${car.pricePerDay}</span>
                  </div>
                  <Link href={`/cars/${car._id}`} className="text-xs font-bold uppercase tracking-widest text-black border border-black px-4 py-2 hover:bg-black hover:text-white transition-colors duration-200">
                    Reserve
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center sm:hidden">
            <Link href="/cars" className="text-sm font-bold tracking-widest uppercase border-b-2 border-black pb-1">
              View All Vehicles
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
