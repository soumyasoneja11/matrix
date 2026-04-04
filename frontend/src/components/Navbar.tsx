import React from 'react';
import { motion } from 'framer-motion';
import { LogOut } from 'lucide-react';
import { useAuth } from '../hooks/contexts/AuthContext';

interface NavbarProps {
  activeQueue: {
    critical: number;
    urgent: number;
    standard: number;
  };
}

export function Navbar({ activeQueue }: NavbarProps) {
  const { user, logout, isDemo } = useAuth();

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-forest-100/40 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-8 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">ER</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-forest-900 tracking-tight">
                ER Triage Sprint
              </h1>
              <p className="text-[11px] text-forest-400">
                {isDemo ? 'Demo Mode' : 'System Administrator'}
              </p>
            </div>
          </div>

          {/* Queue Status — spaced evenly */}
          <div className="hidden md:flex items-center gap-4">
            <span className="text-xs font-semibold text-forest-500 uppercase tracking-wider">Queue</span>
            <div className="flex items-center gap-2">
              <QueueBadge count={activeQueue.critical} color="red" />
              <QueueBadge count={activeQueue.urgent} color="amber" />
              <QueueBadge count={activeQueue.standard} color="green" />
            </div>
          </div>

          {/* User + Sign Out */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-xl bg-forest-50/60 border border-forest-100/60">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-forest-600 to-forest-700 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                {(user?.fullName || user?.username || 'U')[0].toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-forest-800 leading-none">
                  {user?.fullName || user?.username || 'User'}
                </p>
                <p className="text-[11px] text-forest-400 mt-0.5">
                  {user?.role || 'SUPERVISOR'}
                </p>
              </div>
            </div>

            <motion.button
              onClick={logout}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2.5 rounded-xl bg-white hover:bg-red-50 border border-forest-100/60 hover:border-red-200 text-forest-500 hover:text-red-600 transition-all shadow-sm cursor-pointer"
              title="Sign Out"
            >
              <LogOut size={17} />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

function QueueBadge({ count, color }: { count: number; color: 'red' | 'amber' | 'green' }) {
  const styles = {
    red:   { bg: 'bg-red-50',     text: 'text-red-700',     border: 'border-red-200/60',     dot: 'bg-red-500' },
    amber: { bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200/60',   dot: 'bg-amber-500' },
    green: { bg: 'bg-primary-50', text: 'text-primary-700', border: 'border-primary-200/60', dot: 'bg-primary-500' },
  };
  const s = styles[color];

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${s.bg} border ${s.border}`}>
      <span className={`w-2 h-2 rounded-full ${s.dot} ${count > 0 ? 'animate-pulse' : ''}`} />
      <span className={`text-xs font-bold ${s.text}`}>{count}</span>
    </div>
  );
}

export default Navbar;