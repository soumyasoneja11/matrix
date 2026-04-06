import { useState, useRef, useEffect } from 'react';
import { FaBell, FaUserCircle, FaSearch } from 'react-icons/fa';
import { Sun, Moon, PanelLeftClose, PanelLeftOpen, Bell, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../hooks/contexts/ThemeContext';
import { useSidebar } from '../hooks/contexts/SidebarContext';

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

  const mockNotifications = [
    { id: 1, type: 'alert', title: 'Critical Patient Incoming', message: 'Trauma case arriving in 5 minutes — Bay 3', time: '2 min ago', unread: true },
    { id: 2, type: 'success', title: 'Triage Completed', message: 'Patient John Doe triaged to Urgent zone', time: '15 min ago', unread: true },
    { id: 3, type: 'info', title: 'Shift Change Reminder', message: 'Your shift ends in 1 hour', time: '45 min ago', unread: false },
  ];

  const notifIcon = (type: string) => {
    switch (type) {
      case 'alert': return <AlertTriangle size={16} className="text-red-400" />;
      case 'success': return <CheckCircle2 size={16} className="text-emerald-400" />;
      default: return <Info size={16} className="text-blue-400" />;
    }
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
        
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl theme-bg-hover transition-all cursor-pointer"
            id="notification-bell-btn"
          >
            <FaBell className="theme-text-muted text-xl" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse ring-2 ring-red-500/30" />
          </button>
          
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                className={`absolute right-0 mt-3 w-96 max-w-[calc(100vw-2rem)] rounded-2xl overflow-hidden z-[9999] border ${
                  isLight
                    ? 'bg-white border-gray-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.12)]'
                    : 'bg-[#1a1a2e] border-[#2a2a4a] shadow-[0_8px_30px_rgba(0,0,0,0.5)]'
                }`}
                style={{ backdropFilter: 'none' }}
                id="notification-dropdown"
              >
                {/* Header */}
                <div className={`px-5 py-4 flex items-center justify-between border-b ${
                  isLight ? 'border-gray-100 bg-gray-50/60' : 'border-white/5 bg-white/[0.03]'
                }`}>
                  <div className="flex items-center gap-2">
                    <Bell size={16} className={isLight ? 'text-gray-700' : 'text-gray-200'} />
                    <h3 className={`font-semibold text-sm ${isLight ? 'text-gray-800' : 'text-gray-100'}`}>Notifications</h3>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/15 text-red-400">
                    {mockNotifications.filter(n => n.unread).length} new
                  </span>
                </div>

                {/* Notification Items */}
                <div className="max-h-80 overflow-y-auto">
                  {mockNotifications.map((notif, i) => (
                    <div
                      key={notif.id}
                      className={`px-5 py-3.5 flex gap-3 items-start transition-colors cursor-pointer border-b last:border-b-0 ${
                        isLight
                          ? `border-gray-50 ${notif.unread ? 'bg-primary-50/30' : 'bg-white'} hover:bg-gray-50`
                          : `border-white/[0.04] ${notif.unread ? 'bg-white/[0.03]' : 'bg-transparent'} hover:bg-white/[0.06]`
                      }`}
                    >
                      <div className={`mt-0.5 p-1.5 rounded-lg shrink-0 ${
                        isLight ? 'bg-gray-100' : 'bg-white/5'
                      }`}>
                        {notifIcon(notif.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={`text-sm font-medium truncate ${isLight ? 'text-gray-800' : 'text-gray-100'}`}>
                            {notif.title}
                          </p>
                          {notif.unread && (
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                          )}
                        </div>
                        <p className={`text-xs mt-0.5 line-clamp-1 ${isLight ? 'text-gray-500' : 'text-gray-400'}`}>
                          {notif.message}
                        </p>
                        <p className={`text-[10px] mt-1 ${isLight ? 'text-gray-400' : 'text-gray-500'}`}>
                          {notif.time}
                        </p>
                      </div>
                    </div>
                  ))}
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