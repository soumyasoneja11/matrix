import React from 'react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  icon?: string | React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-12 px-4 text-center"
    >
      {icon && (
        <div className="mb-4 text-5xl opacity-20">
          {typeof icon === 'string' ? icon : icon}
        </div>
      )}
      
      <h3 className="text-sm font-semibold text-forest-700 mb-1">
        {title}
      </h3>
      
      {description && (
        <p className="text-xs text-forest-500 max-w-sm">
          {description}
        </p>
      )}
      
      {action && (
        <motion.button
          onClick={action.onClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-4 px-4 py-2 rounded-lg bg-primary-100 hover:bg-primary-200 text-primary-700 font-semibold text-sm transition-colors"
        >
          {action.label}
        </motion.button>
      )}
    </motion.div>
  );
}

export default EmptyState;