import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../hooks/contexts/ThemeContext';
import { FaExclamationCircle } from 'react-icons/fa';

interface ConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  targetPriority: string;
  patientName?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  targetPriority,
  patientName = 'this patient',
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
          className={`absolute inset-0 backdrop-blur-sm ${
            isLight ? 'bg-gray-900/40' : 'bg-black/60'
          }`}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className={`relative w-full max-w-md p-6 rounded-2xl shadow-xl border overflow-hidden ${
            isLight
              ? 'bg-white border-gray-200'
              : 'glass-card border-white/10'
          }`}
        >
          {/* Decorative background glow for dark mode */}
          {!isLight && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-primary-500/10 blur-[40px] pointer-events-none rounded-full" />
          )}

          <div className="flex flex-col items-center text-center">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${
              isLight ? 'bg-amber-100/80 text-amber-600' : 'bg-amber-500/20 text-amber-400'
            }`}>
              <FaExclamationCircle size={28} />
            </div>

            <h3 className={`text-xl font-bold mb-2 ${isLight ? 'text-gray-900' : 'text-white'}`}>
              Confirm Move
            </h3>
            
            <p className={`text-base mb-6 ${isLight ? 'text-gray-600' : 'text-white/70'}`}>
              Are you sure you want to move <strong>{patientName}</strong> to{' '}
              <span className={`font-semibold ${
                targetPriority === 'CRITICAL' ? (isLight ? 'text-red-600' : 'text-red-400') :
                targetPriority === 'URGENT' ? (isLight ? 'text-amber-600' : 'text-amber-400') :
                (isLight ? 'text-emerald-600' : 'text-emerald-400')
              }`}>
                {targetPriority}
              </span>?
            </p>

            <div className="flex w-full gap-3">
              <button
                onClick={onCancel}
                className={`flex-1 py-2.5 rounded-xl font-semibold transition-all ${
                  isLight
                    ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className={`flex-1 py-2.5 rounded-xl font-semibold transition-all ${
                  isLight
                    ? 'bg-[#247B7B] hover:bg-[#1a5c5c] text-white shadow-md'
                    : 'bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-500/20'
                }`}
              >
                Yes, Move
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ConfirmationModal;
