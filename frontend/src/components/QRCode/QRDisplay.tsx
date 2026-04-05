import React, { useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { QRCodeCanvas } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download } from 'lucide-react';
import { useTheme } from '../../hooks/contexts/ThemeContext';

interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: number;
  patientName: string;
  patientLocation?: string;
}

const QRModal: React.FC<QRModalProps> = ({ isOpen, onClose, patientId, patientName, patientLocation }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const canvasRef = useRef<HTMLDivElement>(null);

  const qrData = JSON.stringify({
    id: `#${patientId}`,
    name: patientName,
    location: patientLocation || 'Unassigned',
  });

  const handleDownload = useCallback(() => {
    const canvas = canvasRef.current?.querySelector('canvas');
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `patient-${patientId}-qr.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, [patientId]);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className={`relative z-10 w-full max-w-sm rounded-2xl shadow-2xl ${
              isLight ? 'bg-white' : 'bg-slate-900 border border-white/10'
            }`}
          >
            {/* Header */}
            <div className={`px-5 py-4 flex items-center justify-between border-b ${
              isLight ? 'border-gray-100' : 'border-white/10'
            }`}>
              <h3 className={`text-base font-bold ${isLight ? 'text-gray-900' : 'text-white'}`}>
                Patient QR Code
              </h3>
              <button
                onClick={onClose}
                className={`p-1.5 rounded-lg transition-colors ${
                  isLight ? 'hover:bg-gray-100 text-gray-400' : 'hover:bg-white/10 text-white/40'
                }`}
              >
                <X size={16} />
              </button>
            </div>

            {/* Content */}
            <div className="px-5 py-6 flex flex-col items-center gap-4">
              {/* Patient info */}
              <div className="text-center">
                <p className={`text-sm font-semibold ${isLight ? 'text-gray-800' : 'text-white/90'}`}>
                  {patientName || 'Unnamed Patient'}
                </p>
                <p className={`text-xs mt-0.5 ${isLight ? 'text-gray-500' : 'text-white/50'}`}>
                  ID #{patientId} · {patientLocation || 'Unassigned'}
                </p>
              </div>

              {/* QR Code */}
              <div
                ref={canvasRef}
                className={`p-4 rounded-xl ${isLight ? 'bg-white border border-gray-100' : 'bg-white rounded-xl'}`}
              >
                <QRCodeCanvas
                  value={qrData}
                  size={180}
                  bgColor="#ffffff"
                  fgColor="#1a2e2e"
                  level="M"
                  includeMargin={false}
                />
              </div>

              {/* Download button */}
              <button
                onClick={handleDownload}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isLight
                    ? 'bg-[#247B7B] text-white hover:bg-[#1e6868] shadow-sm'
                    : 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg'
                }`}
              >
                <Download size={14} />
                Download PNG
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default QRModal;
