import React, { useState } from 'react';
import { Search, Bell, LogOut, Stethoscope, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  activeQueue?: { critical: number; urgent: number; standard: number };
}

export function Navbar({ activeQueue = { critical: 0, urgent: 0, standard: 0 } }: NavbarProps) {
  const { user, logout } = useAuth();
  const [searching, setSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const total = activeQueue.critical + activeQueue.urgent + activeQueue.standard;

  return (
    <>
      <nav className="glass sticky top-0 z-40 px-6 py-3 flex items-center justify-between gap-4 border-b border-white/20">
        {/* Logo */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-md">
            <Stethoscope size={18} className="text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight text-primary-900">ER TRIAGE SPRINT</span>
        </div>

        {/* Center: search + queue */}
        <div className="flex items-center gap-5 flex-1 justify-center">
          <button
            onClick={() => setSearching(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/40 backdrop-blur-sm border border-gray-200/50 text-sm text-gray-500 hover:bg-white/60 transition-all cursor-pointer min-w-[200px]"
          >
            <Search size={15} />
            <span>Find Patient</span>
          </button>

          {/* Active Queue */}
          <div className="flex items-center gap-3 px-5 py-2 rounded-2xl bg-white/40 backdrop-blur-sm border border-gray-200/50">
            <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider mr-1">
              Active Queue
            </div>
            <span className="text-lg font-bold text-gray-800">{total}</span>
            <div className="flex items-center gap-2 ml-1">
              <span className="flex items-center gap-1 text-xs">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span className="font-medium text-red-600">{activeQueue.critical} RED</span>
              </span>
              <span className="flex items-center gap-1 text-xs">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="font-medium text-amber-600">{activeQueue.urgent} AMBER</span>
              </span>
              <span className="flex items-center gap-1 text-xs">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                <span className="font-medium text-green-600">{activeQueue.standard} GREEN</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3 shrink-0">
          <button className="p-2.5 rounded-xl hover:bg-white/40 transition-colors text-gray-500 hover:text-gray-700 relative cursor-pointer">
            <Bell size={18} />
          </button>

          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md">
            <span className="text-sm font-medium">
              Sign Out ({user?.fullName || user?.username})
            </span>
            <button onClick={logout} className="cursor-pointer">
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </nav>

      {/* Search Overlay */}
      <AnimatePresence>
        {searching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-start justify-center pt-24"
            onClick={() => setSearching(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              className="glass rounded-3xl p-6 w-full max-w-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <Search size={20} className="text-primary-500" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search by patient name or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-lg outline-none placeholder:text-gray-400"
                />
                <button onClick={() => setSearching(false)} className="p-1.5 rounded-lg hover:bg-gray-100/50 cursor-pointer">
                  <X size={18} className="text-gray-400" />
                </button>
              </div>
              <p className="text-xs text-gray-400 ml-8">Press enter to search, ESC to close</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
