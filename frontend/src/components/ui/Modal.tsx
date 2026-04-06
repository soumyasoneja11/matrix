import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useTheme } from '../../hooks/contexts/ThemeContext';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`absolute inset-0 backdrop-blur-sm ${
              isLight ? 'bg-black/20' : 'bg-black/50'
            }`}
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`relative rounded-3xl shadow-2xl w-full border ${
              size === 'sm' ? 'max-w-md' : size === 'md' ? 'max-w-lg' : 'max-w-2xl'
            } ${
              isLight
                ? 'bg-white border-gray-200/60 shadow-gray-300/30'
                : 'bg-[#1E1E2F] border-white/10 shadow-black/50'
            }`}
          >
            {title && (
              <div className={`flex items-center justify-between p-6 pb-0`}>
                <h3 className={`text-lg font-semibold ${isLight ? 'text-gray-800' : 'text-gray-100'}`}>
                  {title}
                </h3>
                <button
                  onClick={onClose}
                  className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
                    isLight
                      ? 'hover:bg-gray-100/60 text-gray-400 hover:text-gray-600'
                      : 'hover:bg-white/10 text-gray-500 hover:text-gray-300'
                  }`}
                >
                  <X size={18} />
                </button>
              </div>
            )}
            <div className="p-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
