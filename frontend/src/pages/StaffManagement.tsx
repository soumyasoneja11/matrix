import { motion } from 'framer-motion';
import { FaUserPlus, FaEdit, FaTrash } from 'react-icons/fa';

const StaffManagement = () => {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold gradient-text">Staff Management</h1>
        <p className="text-white/60 mt-2">Manage staff schedules, roles, and permissions</p>
      </motion.div>
      
      <div className="glass-card p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Current Shift</h2>
          <button className="btn-primary flex items-center gap-2">
            <FaUserPlus />
            Add Staff
          </button>
        </div>
        
        <div className="text-center py-12 text-white/40">
          <p>Staff management interface coming soon</p>
          <p className="text-sm mt-2">Schedule shifts, track attendance, and manage credentials</p>
        </div>
      </div>
    </div>
  );
};

export default StaffManagement;