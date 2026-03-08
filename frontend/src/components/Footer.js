import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t-2 border-black pt-16 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <span className="text-2xl font-black text-black tracking-tighter">
              Rentals.co
            </span>
            <p className="mt-4 text-sm text-gray-500 max-w-xs">
              Curated minimal experiences. Premium vehicles only.
            </p>
          </div>
          <div>
            <h3 className="text-xs font-black text-black tracking-widest uppercase mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-sm text-gray-500 hover:text-black transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/cars" className="text-sm text-gray-500 hover:text-black transition-colors">Cars</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-black text-black tracking-widest uppercase mb-4">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-sm text-gray-500 hover:text-black transition-colors">Contact</Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-500 hover:text-black transition-colors">FAQ</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-black text-black tracking-widest uppercase mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-sm text-gray-500 hover:text-black transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-500 hover:text-black transition-colors">Terms</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-base text-gray-400">
            &copy; {new Date().getFullYear()} Rentals Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
