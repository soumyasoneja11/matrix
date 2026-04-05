import { motion } from 'framer-motion';
import { FaTrashAlt } from 'react-icons/fa';
import { useTheme } from '../hooks/contexts/ThemeContext';

const RecycleBin = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className={`text-3xl font-bold ${isLight ? 'text-[#1a2e2e]' : 'gradient-text'}`}>Recycle Bin</h1>
        <p className="theme-text-muted mt-2">Restore or permanently delete archived records</p>
      </motion.div>
      
      <div className="glass-card p-6">
        <div className="text-center py-12">
          <FaTrashAlt className={`text-5xl mx-auto mb-4 ${isLight ? 'text-[#d4cec5]' : 'text-white/20'}`} />
          <p className="theme-text-subtle">No items in recycle bin</p>
          <p className="text-sm theme-text-faint mt-2">Deleted patients appear here for 30 days</p>
        </div>
      </div>
    </div>
  );
};

export default RecycleBin;