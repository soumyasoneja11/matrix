import { useState } from 'react';
import { FaBell, FaUserCircle, FaSearch, FaCloudSun } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="glass-card m-4 mb-0 px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-sm" />
          <input
            type="text"
            placeholder="Search patients, staff, or resources..."
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-primary-500 transition-all"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full">
          <FaCloudSun className="text-yellow-400" />
          <span className="text-sm">24°C · Light rain</span>
        </div>
        
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl hover:bg-white/10 transition-all"
          >
            <FaBell className="text-white/70 text-xl" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          </button>
          
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-80 glass-card overflow-hidden z-50"
              >
                <div className="p-4 border-b border-white/10">
                  <h3 className="font-semibold">Notifications</h3>
                </div>
                <div className="p-4 text-center text-white/60 text-sm">
                  No new notifications
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="flex items-center gap-3 pl-3 border-l border-white/10">
          <div className="text-right">
            <p className="text-sm font-medium">Dr. Sarah Chen</p>
            <p className="text-xs text-white/50">Emergency Lead</p>
          </div>
          <FaUserCircle className="text-3xl text-white/70" />
        </div>
      </div>
    </header>
  );
};

export default Header;