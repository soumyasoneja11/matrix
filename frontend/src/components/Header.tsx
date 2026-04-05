import { useState } from 'react';
import { FaBell, FaUserCircle, FaSearch, FaCloudSun } from 'react-icons/fa';
import { Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../hooks/contexts/ThemeContext';

const Header = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="glass-card m-4 mb-0 px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 theme-text-subtle text-sm" />
          <input
            type="text"
            placeholder="Search patients, staff, or resources..."
            className="w-full pl-10 pr-4 py-2 theme-bg-input border rounded-xl placeholder-current focus:outline-none focus:border-primary-500 transition-all"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 theme-bg-accent rounded-full">
          <FaCloudSun className="text-yellow-400" />
          <span className="text-sm theme-text">24°C · Light rain</span>
        </div>

        {/* Theme Toggle */}
        <motion.button
          onClick={toggleTheme}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-xl theme-bg-hover transition-all cursor-pointer"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          id="theme-toggle-btn"
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-yellow-400" />
          ) : (
            <Moon className="w-5 h-5 text-slate-600" />
          )}
        </motion.button>
        
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl theme-bg-hover transition-all"
          >
            <FaBell className="theme-text-muted text-xl" />
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
                <div className="p-4 border-b theme-border">
                  <h3 className="font-semibold theme-text">Notifications</h3>
                </div>
                <div className="p-4 text-center theme-text-muted text-sm">
                  No new notifications
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="flex items-center gap-3 pl-3 border-l theme-border">
          <div className="text-right">
            <p className="text-sm font-medium theme-text">Dr. Sarah Chen</p>
            <p className="text-xs theme-text-subtle">Emergency Lead</p>
          </div>
          <FaUserCircle className="text-3xl theme-text-muted" />
        </div>
      </div>
    </header>
  );
};

export default Header;