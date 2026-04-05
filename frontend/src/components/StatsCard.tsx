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
      whileHover={{ y: -4 }}
      className="glass-card p-4 hover:shadow-xl transition-all duration-300"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="theme-text-muted text-sm">{label}</p>
          <p className="text-2xl font-bold mt-1 theme-text">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${color} flex items-center justify-center shadow-lg`}>
          <Icon className="text-white text-xl" />
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;