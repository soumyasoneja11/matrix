import React from 'react';
import { motion } from 'framer-motion';
import { IconType } from 'react-icons';

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
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className={`glass-card p-5 hover:shadow-xl transition-all duration-300 ${
        accent ? 'border-primary-500/30 ring-1 ring-primary-500/20' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-white/50 text-sm font-medium truncate">{label}</p>
          <p className="text-3xl font-bold mt-1.5 tracking-tight">{value}</p>
        </div>
        <div
          className={`w-12 h-12 rounded-xl bg-gradient-to-r ${gradient} flex items-center justify-center shadow-lg flex-shrink-0 ml-3`}
        >
          <Icon className="text-white text-xl" />
        </div>
      </div>
    </motion.div>
  );
};

export default AnalyticsCard;
