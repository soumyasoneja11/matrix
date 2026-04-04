import { NavLink } from 'react-router-dom';
import { 
  FaUserInjured, 
  FaBed, 
  FaUsers, 
  FaUserCog, 
  FaClipboardList, 
  FaChartLine, 
  FaTrashAlt,
  FaMicrophone 
} from 'react-icons/fa';
import { motion } from 'framer-motion';

const navItems = [
  { path: '/', icon: FaUserInjured, label: 'Patient Triage', color: 'from-cyan-500 to-blue-500' },
  { path: '/resource-allocation', icon: FaBed, label: 'Resource Allocation', color: 'from-green-500 to-emerald-500' },
  { path: '/staff-directory', icon: FaUsers, label: 'Staff Directory', color: 'from-purple-500 to-pink-500' },
  { path: '/staff-management', icon: FaUserCog, label: 'Staff Management', color: 'from-orange-500 to-red-500' },
  { path: '/my-worklist', icon: FaClipboardList, label: 'My Worklist', color: 'from-yellow-500 to-amber-500' },
  { path: '/analytics', icon: FaChartLine, label: 'Analytics', color: 'from-indigo-500 to-purple-500' },
  { path: '/recycle-bin', icon: FaTrashAlt, label: 'Recycle Bin', color: 'from-gray-500 to-gray-700' },
];

const Sidebar = () => {
  return (
    <motion.aside 
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-72 glass-card m-4 mr-0 flex flex-col overflow-hidden"
    >
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
            <FaMicrophone className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text">VITALPASS</h1>
            <p className="text-xs text-white/50">v2.0 · AI Command Center</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item, index) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group
              ${isActive 
                ? 'bg-gradient-to-r from-primary-600/50 to-purple-600/50 border border-primary-500/30 shadow-lg' 
                : 'hover:bg-white/5'
              }
            `}
          >
            {({ isActive }) => (
              <>
                <div className={`
                  w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300
                  ${isActive 
                    ? `bg-gradient-to-r ${item.color} shadow-lg scale-110` 
                    : 'bg-white/10 group-hover:bg-white/20 group-hover:scale-105'
                  }
                `}>
                  <item.icon className={`text-sm ${isActive ? 'text-white' : 'text-white/70 group-hover:text-white'}`} />
                </div>
                <span className={`flex-1 font-medium ${isActive ? 'text-white' : 'text-white/80 group-hover:text-white'}`}>
                  {item.label}
                </span>
                {isActive && (
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
      
      <div className="p-4 border-t border-white/10">
        <div className="glass-card p-3 text-center">
          <div className="text-2xl mb-1">🏥</div>
          <p className="text-xs text-white/60">AI-driven triage active</p>
          <div className="w-full h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
            <div className="h-full w-3/4 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;