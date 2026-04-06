import { motion } from 'framer-motion';
import { IconType } from 'react-icons';
import { useTheme } from '../hooks/contexts/ThemeContext';

interface StatsCardProps {
  icon: IconType;
  label: string;
  value: string | number;
  color: string;
  delay: number;
}

const StatsCard: React.FC<StatsCardProps> = ({ icon: Icon, label, value, color, delay }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -4, scale: 1.02 }}
      className={`relative overflow-hidden p-4 rounded-xl transition-all duration-200 ${
        isLight
          ? 'bg-gradient-to-br from-[#247B7B] via-[#2f8f87] to-[#4C9A8E] shadow-md hover:shadow-lg shadow-[#247B7B]/20 ring-1 ring-[#247B7B]/10'
          : 'glass-card hover:shadow-xl'
      }`}
    >
      {isLight && (
        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-transparent pointer-events-none mix-blend-overlay" />
      )}
      <div className="flex items-center justify-between relative z-10">
        <div>
          <p className={`text-sm ${isLight ? 'text-white/80' : 'theme-text-muted'}`}>{label}</p>
          <p className={`text-2xl font-bold mt-1 ${isLight ? 'text-white' : 'theme-text'}`}>{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
          isLight
            ? 'bg-white/20'
            : `bg-gradient-to-r ${color}`
        }`}>
          <Icon className="text-white text-xl" />
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;