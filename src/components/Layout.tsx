import { Link, Outlet } from 'react-router-dom';
import { Film, Search, Bell, User } from 'lucide-react';

export function Layout() {
  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm border-b border-white/5">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-red-600 font-bold text-lg tracking-tighter">
            <Film className="w-6 h-6" />
            MafiaCine
          </Link>

          <div className="hidden md:flex items-center gap-8 text-[11px] font-medium text-gray-300">
            <Link to="/" className="text-white hover:text-red-500 transition-colors">Home</Link>
            <Link to="#" className="hover:text-red-500 transition-colors">Movies</Link>
            <Link to="#" className="hover:text-red-500 transition-colors">Series</Link>
            <Link to="#" className="hover:text-red-500 transition-colors">Live</Link>
            <Link to="#" className="hover:text-red-500 transition-colors">My List</Link>
          </div>

          <div className="flex items-center gap-6 text-gray-300">
            <button className="hover:text-white transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button className="hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <button className="hover:text-white transition-colors">
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>
      
      <main>
        <Outlet />
      </main>
      
      <footer className="bg-black border-t border-white/10 py-12 mt-20">
        <div className="container mx-auto px-4 text-center text-gray-500 text-xs">
          <p>&copy; 2024 MafiaCine. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
