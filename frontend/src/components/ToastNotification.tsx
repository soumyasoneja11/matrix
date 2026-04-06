import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';
import { useTheme } from '../hooks/contexts/ThemeContext';

export interface ToastProps {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onClose: (id: string) => void;
}

const ToastNotification: React.FC<ToastProps> = ({
  id,
  message,
  type = 'success',
  duration = 3000,
  onClose,
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  const Icon = type === 'error' ? XCircle : CheckCircle;
  const colorClass = type === 'error' 
    ? (isLight ? 'text-red-500 bg-red-50 border-red-200' : 'text-red-400 bg-red-900/40 border-red-500/30')
    : (isLight ? 'text-emerald-600 bg-emerald-50 border-emerald-200' : 'text-emerald-400 bg-emerald-900/40 border-emerald-500/30');

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border backdrop-blur-md z-[9999] pointer-events-auto ${colorClass}`}
    >
      <Icon size={20} />
      <span className={`font-medium text-sm ${isLight ? 'text-gray-800' : 'text-white'}`}>
        {message}
      </span>
    </motion.div>
  );
};

export default ToastNotification;
