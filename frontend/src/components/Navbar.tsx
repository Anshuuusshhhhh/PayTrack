import React from 'react';
import { ChevronDown, Bell, Search } from 'lucide-react';

// 1. Define the props (So App.tsx can pass data in)
interface NavbarProps {
  username: string;
  onLogout: () => void;
}

export default function Navbar({ username, onLogout }: NavbarProps) {
  
  // Helper to get initials (e.g., "alice" -> "AL")
  const initials = username ? username.substring(0, 2).toUpperCase() : 'US';

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-indigo-100 sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 text-2xl" style={{ fontWeight: 700 }}>
                PayTrack
              </div>
              <div className="text-xs text-slate-500">Financial Dashboard</div>
            </div>
          </div>
          
          {/* Center Search */}
          <div className="hidden md:flex items-center bg-slate-100 rounded-xl px-4 py-2 w-96">
            <Search className="w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search transactions..." 
              className="bg-transparent border-none outline-none ml-2 w-full text-sm text-slate-700 placeholder-slate-400"
            />
          </div>
          
          {/* User Profile Section */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <div className="relative cursor-pointer hover:bg-slate-100 p-2 rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-slate-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </div>
            
            <div className="flex items-center gap-2 cursor-pointer hover:bg-slate-100 px-3 py-2 rounded-xl transition-colors">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg">
                {/* Dynamic Initials */}
                <span className="text-sm" style={{ fontWeight: 600 }}>{initials}</span>
              </div>
              <div className="hidden md:block">
                {/* Dynamic Username */}
                <div className="text-sm text-slate-700" style={{ fontWeight: 600 }}>{username}</div>
                <div className="text-xs text-slate-500">User ID: {initials}</div>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </div>
            
            <button 
              onClick={onLogout} // Added onClick handler
              className="text-red-500 hover:bg-red-50 transition-colors px-4 py-2 rounded-lg" 
              style={{ fontWeight: 600 }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}