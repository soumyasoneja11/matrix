import { motion } from 'framer-motion';
import { FaUserPlus } from 'react-icons/fa';
import { useTheme } from '../hooks/contexts/ThemeContext';

const StaffManagement = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className={`text-3xl font-bold ${isLight ? 'text-[#1a2e2e]' : 'gradient-text'}`}>Staff Management</h1>
        <p className="theme-text-muted mt-2">Manage staff schedules, roles, and permissions</p>
      </motion.div>
      
      <div className="glass-card p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold theme-text">Current Shift</h2>
          <button className="btn-primary flex items-center gap-2">
            <FaUserPlus />
            Add Staff
          </button>
        </div>
        
        <div className="text-center py-12 theme-text-subtle">
          <p>Staff management interface coming soon</p>
          <p className="text-sm mt-2">Schedule shifts, track attendance, and manage credentials</p>
        </div>
      </div>
    </div>
  );
};

export default StaffManagement;