import { motion } from 'framer-motion';
import { FaUserMd, FaStethoscope, FaUserNurse, FaPhone, FaEnvelope } from 'react-icons/fa';
import { useTheme } from '../hooks/contexts/ThemeContext';

const StaffDirectory = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const staff = [
    { name: 'Dr. Sarah Chen', role: 'Emergency Physician', department: 'ER', status: 'online', icon: FaUserMd, color: 'from-blue-500 to-cyan-500' },
    { name: 'Dr. James Wilson', role: 'Trauma Surgeon', department: 'Surgery', status: 'busy', icon: FaStethoscope, color: 'from-purple-500 to-pink-500' },
    { name: 'Nurse Emily Rodriguez', role: 'Head Nurse', department: 'ER', status: 'online', icon: FaUserNurse, color: 'from-green-500 to-emerald-500' },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className={`text-3xl font-bold ${isLight ? 'text-[#1a2e2e]' : 'gradient-text'}`}>Staff Directory</h1>
        <p className="theme-text-muted mt-2">Connect with your team members</p>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {staff.map((member, idx) => (
          <motion.div
            key={member.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ y: -4 }}
            className="glass-card p-6"
          >
            <div className="flex items-start gap-4">
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${member.color} flex items-center justify-center`}>
                <member.icon className="text-white text-2xl" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold theme-text">{member.name}</h3>
                <p className={`text-sm ${isLight ? 'text-[#247B7B]' : 'text-primary-300'}`}>{member.role}</p>
                <p className="text-xs theme-text-muted">{member.department}</p>
                <div className="flex gap-3 mt-3">
                  <FaPhone className={`cursor-pointer transition-colors ${isLight ? 'text-[#94a3a3] hover:text-[#247B7B]' : 'text-white/40 hover:text-primary-400'}`} />
                  <FaEnvelope className={`cursor-pointer transition-colors ${isLight ? 'text-[#94a3a3] hover:text-[#247B7B]' : 'text-white/40 hover:text-primary-400'}`} />
                </div>
              </div>
              <div className={`w-2 h-2 rounded-full ${member.status === 'online' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default StaffDirectory;