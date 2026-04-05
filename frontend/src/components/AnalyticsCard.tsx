import React from 'react';
import { motion } from 'framer-motion';
import { IconType } from 'react-icons';
import { useTheme } from '../hooks/contexts/ThemeContext';

interface AnalyticsCardProps {
  icon: IconType;
  label: string;
  value: string | number;
  gradient: string;
  delay?: number;
  accent?: boolean;
}

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
  icon: Icon,
  label,
  value,
  gradient,
  delay = 0,
  accent = false,
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className={`p-5 rounded-xl transition-all duration-200 ${
        isLight
          ? `bg-gradient-to-br from-[#247B7B] to-[#4C9A8E] shadow-md hover:shadow-lg ${
              accent ? 'ring-2 ring-white/30' : ''
            }`
          : `glass-card hover:shadow-xl ${
              accent ? 'border-primary-500/30 ring-1 ring-primary-500/20' : ''
            }`
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium truncate ${isLight ? 'text-white/80' : 'theme-text-muted'}`}>{label}</p>
          <p className={`text-3xl font-bold mt-1.5 tracking-tight ${isLight ? 'text-white' : 'theme-text'}`}>{value}</p>
        </div>
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 ml-3 ${
            isLight
              ? 'bg-white/20'
              : `bg-gradient-to-r ${gradient}`
          }`}
        >
          <Icon className="text-white text-xl" />
        </div>
      </div>
    </motion.div>
  );
};

export default AnalyticsCard;
