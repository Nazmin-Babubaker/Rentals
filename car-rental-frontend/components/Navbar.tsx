import Link from "next/link";
import { Car, User, Calendar } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-6 bg-white border-b border-gray-100 sticky top-0 z-50">
      <Link href="/" className="text-xl font-black tracking-tighter uppercase">
        Drive<span className="text-blue-600">.</span>
      </Link>
      
      <div className="flex items-center gap-8 text-sm font-medium">
        <Link href="/cars" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
          <Car size={18} /> Browse
        </Link>
        <Link href="/bookings" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
          <Calendar size={18} /> My Bookings
        </Link>
        <Link href="/login" className="flex items-center gap-2 bg-brand-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition-all">
          <User size={18} /> Sign In
        </Link>
      </div>
    </nav>
  );
}