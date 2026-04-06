import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../hooks/contexts/ThemeContext';
import { FaSignOutAlt } from 'react-icons/fa';

interface DischargeConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  patientName?: string;
  isProcessing?: boolean;
}

const DischargeConfirmModal: React.FC<DischargeConfirmModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  patientName = 'this patient',
  isProcessing = false,
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
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
          {/* Decorative glow */}
          {!isLight && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-red-500/10 blur-[40px] pointer-events-none rounded-full" />
          )}

          <div className="flex flex-col items-center text-center">
            {/* Icon */}
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${
              isLight ? 'bg-red-100/80 text-red-600' : 'bg-red-500/20 text-red-400'
            }`}>
              <FaSignOutAlt size={24} />
            </div>

            <h3 className={`text-xl font-bold mb-2 ${isLight ? 'text-gray-900' : 'text-white'}`}>
              Discharge Patient
            </h3>

            <p className={`text-base mb-6 ${isLight ? 'text-gray-600' : 'text-white/70'}`}>
              Are you sure you want to discharge{' '}
              <strong>{patientName}</strong>?
              <br />
              <span className={`text-sm ${isLight ? 'text-gray-400' : 'text-white/40'}`}>
                The patient will be moved to the recycle bin for 10 days.
              </span>
            </p>

            <div className="flex w-full gap-3">
              <button
                onClick={onCancel}
                disabled={isProcessing}
                className={`flex-1 py-2.5 rounded-xl font-semibold transition-all ${
                  isLight
                    ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                } disabled:opacity-50`}
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={isProcessing}
                className={`flex-1 py-2.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                  isLight
                    ? 'bg-red-600 hover:bg-red-700 text-white shadow-md'
                    : 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-500/20'
                } disabled:opacity-50`}
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Yes, Discharge'
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
};

export default DischargeConfirmModal;
