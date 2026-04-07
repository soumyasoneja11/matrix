import { NavLink } from 'react-router-dom';
import { 
  FaHome,
  FaUserInjured, 
  FaBed, 
  FaUsers, 
  FaUserCog, 
  FaClipboardList, 
  FaChartLine, 
  FaTrashAlt,
  FaMicrophone,
  FaHistory,
  FaIdCard,
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useTheme } from '../hooks/contexts/ThemeContext';
import { useAuth } from '../hooks/contexts/AuthContext';

const staffNavItems = [
  { path: '/', icon: FaHome, label: 'Home', color: 'from-primary-500 to-purple-500' },
  { path: '/triage', icon: FaUserInjured, label: 'Patient Triage', color: 'from-cyan-500 to-blue-500' },
  { path: '/resource-allocation', icon: FaBed, label: 'Resource Allocation', color: 'from-green-500 to-emerald-500' },
  { path: '/staff-directory', icon: FaUsers, label: 'Staff Directory', color: 'from-purple-500 to-pink-500' },
  { path: '/staff-management', icon: FaUserCog, label: 'Staff Management', color: 'from-orange-500 to-red-500' },
  { path: '/my-worklist', icon: FaClipboardList, label: 'My Worklist', color: 'from-yellow-500 to-amber-500' },
  { path: '/patient-history', icon: FaHistory, label: 'Patient History', color: 'from-teal-500 to-cyan-500' },
  { path: '/analytics', icon: FaChartLine, label: 'Analytics', color: 'from-indigo-500 to-purple-500' },
  { path: '/recycle-bin', icon: FaTrashAlt, label: 'Recycle Bin', color: 'from-gray-500 to-gray-700' },
];

const patientNavItems = [
  { path: '/', icon: FaHome, label: 'Home', color: 'from-primary-500 to-purple-500' },
  { path: '/patient-history', icon: FaHistory, label: 'My History', color: 'from-teal-500 to-cyan-500' },
  { path: '/patient/me', icon: FaIdCard, label: 'My Record', color: 'from-emerald-500 to-green-500' },
];

const Sidebar = () => {
  const { theme } = useTheme();
  const { isPatient, isAdmin } = useAuth();
  const isLight = theme === 'light';

  const navItems = isPatient
    ? patientNavItems
    : staffNavItems.filter((item) => {
        if (!isAdmin && item.path === '/staff-management') return false;
        if (!isAdmin && item.path === '/recycle-bin') return false;
        return true;
      });

  return (
    <motion.aside 
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-72 glass-card m-4 mr-0 flex flex-col overflow-hidden"
    >
      <div className="p-6 border-b theme-border">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            isLight ? 'bg-[#247B7B]' : 'bg-gradient-to-br from-primary-500 to-purple-600'
          }`}>
            <FaMicrophone className="text-white text-xl" />
          </div>
          <div>
            <h1 className={`text-xl font-bold ${isLight ? 'text-[#1a2e2e]' : 'gradient-text'}`}>VITALPASS</h1>
            <p className="text-xs theme-text-subtle">v2.0 · AI Command Center</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group
              ${isActive 
                ? isLight
                  ? 'bg-[#e8f5f5] border-l-[3px] border-l-[#247B7B] shadow-sm'
                  : 'bg-gradient-to-r from-primary-600/50 to-purple-600/50 border border-primary-500/30 shadow-lg'
                : isLight
                  ? 'hover:bg-[#f4f0e8]'
                  : 'hover:bg-white/5'
              }
            `}
          >
            {({ isActive }) => (
              <>
                <div className={`
                  w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300
                  ${isActive 
                    ? isLight
                      ? 'bg-[#247B7B] shadow-sm'
                      : `bg-gradient-to-r ${item.color} shadow-lg scale-110`
                    : isLight
                      ? 'bg-[#e8e2d9] group-hover:bg-[#d4cec5] group-hover:scale-105'
                      : 'bg-white/10 group-hover:bg-white/20 group-hover:scale-105'
                  }
                `}>
                  <item.icon className={`text-sm ${
                    isActive 
                      ? 'text-white' 
                      : isLight
                        ? 'text-[#6b7e7e] group-hover:text-[#1a2e2e]'
                        : 'text-white/70 group-hover:text-white'
                  }`} />
                </div>
                <span className={`flex-1 font-medium ${
                  isActive 
                    ? isLight ? 'text-[#247B7B] font-semibold' : 'text-white'
                    : isLight
                      ? 'text-[#3d5555] group-hover:text-[#1a2e2e]'
                      : 'text-white/80 group-hover:text-white'
                }`}>
                  {item.label}
                </span>
                {isActive && !isLight && (
                  <motion.div 
                    layoutId="activeTab"
                    className="w-1 h-8 rounded-full bg-gradient-to-b from-primary-400 to-purple-400"
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 border-t theme-border">
        <div className="glass-card p-3 text-center">
          <div className="text-2xl mb-1">🏥</div>
          <p className="text-xs theme-text-muted">AI-driven triage active</p>
          <div className={`w-full h-1 rounded-full mt-2 overflow-hidden ${isLight ? 'bg-[#e8e2d9]' : 'bg-white/10'}`}>
            <div className={`h-full w-3/4 rounded-full animate-pulse ${isLight ? 'bg-[#247B7B]' : 'bg-gradient-to-r from-primary-500 to-purple-500'}`} />
          </div>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;