import { useState, useRef, useEffect } from 'react';
import { FaBell, FaUserCircle, FaSearch } from 'react-icons/fa';

import { CheckCheck, Trash2, Sun, Moon, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../hooks/contexts/ThemeContext';
import { useSidebar } from '../hooks/contexts/SidebarContext';
// ✅ FIX (Issue 2): import the notification context
import { useNotifications } from '../hooks/contexts/NotificationContext';

const Header = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { isCollapsed, toggleSidebar } = useSidebar();
  const isLight = theme === 'light';
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifications]);



  // ✅ FIX: Previously Header hardcoded "No new notifications" and never
  // connected to NotificationContext at all. Now it reads live from the context
  // that TriageBoard writes to via addNotification().
  const { notifications, unreadCount, markAllRead, clearAll } = useNotifications();

  const handleBellClick = () => {
    setShowNotifications(prev => !prev);
    // Mark all read when panel opens
    if (!showNotifications && unreadCount > 0) {
      markAllRead();
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const typeStyles = {
    success: isLight
      ? 'bg-emerald-50 border-l-2 border-emerald-400'
      : 'bg-emerald-500/10 border-l-2 border-emerald-500',
    error: isLight
      ? 'bg-red-50 border-l-2 border-red-400'
      : 'bg-red-500/10 border-l-2 border-red-500',
    info: isLight
      ? 'bg-blue-50 border-l-2 border-blue-400'
      : 'bg-blue-500/10 border-l-2 border-blue-500',
  };

  const dotStyles = {
    success: 'bg-emerald-400',
    error: 'bg-red-400',
    info: 'bg-blue-400',
  };

  return (
    <header className="glass-card m-4 mb-0 px-5 py-2.5 flex justify-between items-center overflow-visible relative" style={{ zIndex: 50 }}>
      <div className="flex items-center gap-3 flex-1 max-w-md">
        {/* Sidebar Toggle */}
        <motion.button
          onClick={toggleSidebar}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-xl theme-bg-hover transition-all cursor-pointer"
          title={isCollapsed ? 'Show Sidebar' : 'Hide Sidebar'}
          id="sidebar-toggle-btn"
        >
          {isCollapsed ? (
            <PanelLeftOpen className="w-5 h-5 theme-text-muted" />
          ) : (
            <PanelLeftClose className="w-5 h-5 theme-text-muted" />
          )}
        </motion.button>

        {/* Search */}
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

        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={handleBellClick}
            className="relative p-2 rounded-xl theme-bg-hover transition-all cursor-pointer"
            id="notification-bell-btn"
          >
            <FaBell className="theme-text-muted text-xl" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[16px] h-4 px-0.5 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-[9px] font-bold text-white leading-none">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-80 glass-card overflow-hidden z-50 shadow-xl"
              >
                {/* Panel header */}
                <div className={`px-4 py-3 border-b flex items-center justify-between ${isLight ? 'border-gray-100' : 'border-white/10'}`}>
                  <h3 className="font-semibold theme-text text-sm">
                    Notifications
                    {notifications.length > 0 && (
                      <span className={`ml-2 text-xs font-normal ${isLight ? 'text-gray-400' : 'text-white/40'}`}>
                        {notifications.length}
                      </span>
                    )}
                  </h3>
                  {notifications.length > 0 && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={markAllRead}
                        className={`p-1 rounded transition-colors ${isLight ? 'hover:bg-gray-100 text-gray-400 hover:text-gray-600' : 'hover:bg-white/10 text-white/30 hover:text-white/60'}`}
                        title="Mark all read"
                      >
                        <CheckCheck size={13} />
                      </button>
                      <button
                        onClick={clearAll}
                        className={`p-1 rounded transition-colors ${isLight ? 'hover:bg-gray-100 text-gray-400 hover:text-red-400' : 'hover:bg-white/10 text-white/30 hover:text-red-400'}`}
                        title="Clear all"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Notification list */}
                <div className="overflow-y-auto max-h-72">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center">
                      <FaBell className={`mx-auto mb-2 text-2xl ${isLight ? 'text-gray-200' : 'text-white/10'}`} />
                      <p className={`text-sm ${isLight ? 'text-gray-400' : 'text-white/30'}`}>
                        No notifications yet
                      </p>
                      <p className={`text-xs mt-1 ${isLight ? 'text-gray-300' : 'text-white/20'}`}>
                        Patient moves will appear here
                      </p>
                    </div>
                  ) : (
                    <div className="py-1">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`mx-2 my-1 px-3 py-2.5 rounded-lg text-sm ${typeStyles[n.type]} ${
                            !n.read ? 'opacity-100' : (isLight ? 'opacity-60' : 'opacity-40')
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${dotStyles[n.type]}`} />
                            <div className="flex-1 min-w-0">
                              <p className={`leading-snug ${isLight ? 'text-gray-700' : 'text-white/80'}`}>
                                {n.message}
                              </p>
                              <p className={`text-[10px] mt-0.5 ${isLight ? 'text-gray-400' : 'text-white/30'}`}>
                                {formatTime(n.time)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className={`px-5 py-3 text-center border-t ${
                  isLight ? 'border-gray-100 bg-gray-50/40' : 'border-white/5 bg-white/[0.02]'
                }`}>
                  <button className={`text-xs font-medium transition-colors ${
                    isLight ? 'text-primary-600 hover:text-primary-700' : 'text-primary-400 hover:text-primary-300'
                  }`}>
                    View all notifications
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User info */}
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