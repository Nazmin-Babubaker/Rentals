import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="flex flex-col w-full bg-white text-black font-sans pt-16">
      
      {/* Hero Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter mb-8 max-w-4xl">
          We redefine the journey.
        </h1>
        <div className="w-24 h-2 bg-black mb-12"></div>
        <p className="text-xl md:text-2xl text-gray-500 font-light max-w-3xl leading-relaxed">
          DRIVE was founded on a singular principle: cut the noise, deliver the experience. 
          We provide access to the world’s most premium vehicles without the typical rental friction.
        </p>
      </section>

      {/* Philosophy Split Section */}
      <section className="w-full bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 h-[400px] lg:h-[600px] bg-gray-200 relative overflow-hidden group">
               <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center grayscale opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-[2s]"></div>
            </div>
            
            <div className="order-1 lg:order-2 flex flex-col justify-center">
              <h2 className="text-sm font-bold tracking-widest uppercase text-gray-400 mb-4">Our Philosophy</h2>
              <h3 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-8">Less Paperwork.<br/>More Asphalt.</h3>
              <p className="text-lg text-gray-600 font-light mb-6">
                The traditional car rental model is broken. It's built on hidden fees, up-sells, and long lines at airport counters.
              </p>
              <p className="text-lg text-gray-600 font-light mb-8">
                We stripped everything away. You browse our curated fleet, reserve your vehicle online, and walk straight to the driver's seat. Your phone is your key. Your journey is your own.
              </p>
              <Link href="/cars" className="text-xs font-bold uppercase tracking-widest text-black border-b-2 border-black pb-1 self-start hover:text-gray-500 hover:border-gray-500 transition-colors">
                View the Fleet →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="w-full py-32 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
            
            <div className="flex flex-col items-center">
              <span className="text-6xl font-black mb-6">01.</span>
              <h4 className="text-xl font-bold uppercase tracking-widest mb-4">Curation</h4>
              <p className="text-gray-400 font-light px-4">
                We don't do economy boxes. Every vehicle in our fleet is hand-selected for performance, design, and driving pleasure.
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              <span className="text-6xl font-black mb-6">02.</span>
              <h4 className="text-xl font-bold uppercase tracking-widest mb-4">Transparency</h4>
              <p className="text-gray-400 font-light px-4">
                The daily rate you see is the rate you pay. No hidden insurance surcharges, no surprise fueling fees.
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              <span className="text-6xl font-black mb-6">03.</span>
              <h4 className="text-xl font-bold uppercase tracking-widest mb-4">Velocity</h4>
              <p className="text-gray-400 font-light px-4">
                From reservation to ignition in under two minutes. Our digital-first approach accelerates your departure.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-32 bg-white text-center border-b border-gray-200">
        <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-8">Ready to Drive?</h2>
        <div className="flex gap-4 justify-center">
            <Link href="/signup" className="text-sm font-bold uppercase tracking-widest text-white bg-black px-10 py-5 hover:bg-gray-800 transition-colors">
              Join DRIVE
            </Link>
            <Link href="/cars" className="text-sm font-bold uppercase tracking-widest text-black border border-black px-10 py-5 hover:bg-gray-50 transition-colors">
              Explore Fleet
            </Link>
        </div>
      </section>

    </div>
  );
}
