import React, { useState, useRef, useCallback } from 'react';
import { PatientHistoryRecord, TriageLevel } from '../../types';
import { useTheme } from '../../hooks/contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCalendarAlt, FaHospital } from 'react-icons/fa';
import { QrCode, ChevronRight, Download, Copy, Check } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';

interface PatientHistoryCardProps {
  patient: PatientHistoryRecord;
  index: number;
  onClick: () => void;
}

const PatientHistoryCard: React.FC<PatientHistoryCardProps> = ({ patient, index, onClick }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [isQRHovered, setIsQRHovered] = useState(false);
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  const profileUrl = `${window.location.origin}/patient/${patient.id}`;

  const latestVisit = patient.visits[0];
  const totalVisits = patient.visits.length;
  const lastVisitDate = new Date(latestVisit?.date || Date.now());
  const departments = [...new Set(patient.visits.map(v => v.department).filter(Boolean))];

  // Severity based on most recent visit
  const getLatestSeverityBorder = () => {
    switch (latestVisit?.triageLevel) {
      case TriageLevel.CRITICAL:
        return isLight ? 'border-l-red-400' : 'border-l-red-500';
      case TriageLevel.URGENT:
        return isLight ? 'border-l-amber-400' : 'border-l-amber-500';
      default:
        return isLight ? 'border-l-emerald-400' : 'border-l-emerald-500';
    }
  };

  const getStatusBadge = () => {
    const hasOngoing = patient.visits.some(v => v.status === 'ongoing');
    const hasFollowUp = patient.visits.some(v => v.status === 'follow-up');

    if (hasOngoing) {
      return {
        label: 'Active',
        className: isLight
          ? 'bg-blue-50 text-blue-600 border-blue-200'
          : 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      };
    }
    if (hasFollowUp) {
      return {
        label: 'Follow-up',
        className: isLight
          ? 'bg-purple-50 text-purple-600 border-purple-200'
          : 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      };
    }
    return {
      label: 'Completed',
      className: isLight
        ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    };
  };

  const handleDownloadQR = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const canvas = qrRef.current?.querySelector('canvas');
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `patient-${patient.id}-qr.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, [patient.id]);

  const handleCopyLink = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(profileUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [profileUrl]);

  const status = getStatusBadge();
  const labelClass = `text-[10px] font-semibold uppercase tracking-wider ${isLight ? 'text-gray-400' : 'text-white/35'}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.3 }}
      whileHover={{ y: -3 }}
      onClick={onClick}
      className={`
        glass-card border-l-[3px] cursor-pointer transition-all duration-200 relative
        ${getLatestSeverityBorder()}
        ${isLight
          ? 'hover:shadow-md'
          : 'hover:bg-white/[0.07]'
        }
      `}
    >
      {/* ── Inline QR Code (top-right corner) ── */}
      <div
        className="absolute top-3 right-3 z-10"
        onClick={(e) => e.stopPropagation()}
        onMouseEnter={() => setIsQRHovered(true)}
        onMouseLeave={() => setIsQRHovered(false)}
      >
        <div className="relative group" title="Scan for quick access">
          {/* QR Code container */}
          <motion.div
            ref={qrRef}
            animate={{ scale: isQRHovered ? 1.15 : 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className={`rounded-lg p-1 transition-shadow duration-200 ${
              isLight
                ? 'bg-white border border-gray-100 shadow-sm'
                : 'bg-white rounded-lg'
            } ${isQRHovered ? (isLight ? 'shadow-md ring-2 ring-[#247B7B]/20' : 'shadow-lg ring-2 ring-primary-500/30') : ''}`}
          >
            <QRCodeCanvas
              value={profileUrl}
              size={48}
              bgColor="#ffffff"
              fgColor="#1a2e2e"
              level="M"
              includeMargin={false}
            />
          </motion.div>

          {/* Tooltip */}
          <AnimatePresence>
            {isQRHovered && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className={`absolute top-full right-0 mt-2 flex flex-col items-stretch gap-1 min-w-[120px] p-1.5 rounded-lg shadow-xl z-20 ${
                  isLight
                    ? 'bg-white border border-gray-200'
                    : 'bg-slate-800 border border-white/10'
                }`}
              >
                <p className={`text-[9px] font-medium text-center px-1 pb-1 ${
                  isLight ? 'text-gray-400' : 'text-white/40'
                }`}>
                  Scan for quick access
                </p>
                <button
                  onClick={handleDownloadQR}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-medium transition-colors ${
                    isLight
                      ? 'text-gray-600 hover:bg-gray-50'
                      : 'text-white/70 hover:bg-white/10'
                  }`}
                >
                  <Download size={10} />
                  Download QR
                </button>
                <button
                  onClick={handleCopyLink}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-medium transition-colors ${
                    isLight
                      ? 'text-gray-600 hover:bg-gray-50'
                      : 'text-white/70 hover:bg-white/10'
                  }`}
                >
                  {copied ? <Check size={10} className="text-emerald-500" /> : <Copy size={10} />}
                  {copied ? 'Copied!' : 'Copy Link'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Header: Name + Status */}
        <div className="flex items-start justify-between gap-3 pr-16">
          <div className="min-w-0">
            <h3 className={`font-bold text-base ${isLight ? 'text-gray-900' : 'text-white'}`}>
              {patient.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono ${isLight ? 'bg-gray-100 text-gray-500' : 'bg-white/8 text-white/40'}`}>
                #{patient.id}
              </span>
              <span className={`text-xs ${isLight ? 'text-gray-400' : 'text-white/40'}`}>
                {patient.age ? `${patient.age}y` : ''}
                {patient.gender ? ` · ${patient.gender}` : ''}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${status.className}`}>
              {status.label}
            </span>
          </div>
        </div>

        {/* Latest complaint */}
        <div>
          <p className={labelClass}>Latest Complaint</p>
          <p className={`text-sm mt-0.5 ${isLight ? 'text-gray-700' : 'text-white/80'}`}>
            {latestVisit?.complaint || 'No records'}
          </p>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <FaCalendarAlt size={10} className={isLight ? 'text-gray-400' : 'text-white/35'} />
            <span className={`text-xs ${isLight ? 'text-gray-500' : 'text-white/50'}`}>
              {lastVisitDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <FaHospital size={10} className={isLight ? 'text-gray-400' : 'text-white/35'} />
            <span className={`text-xs ${isLight ? 'text-gray-500' : 'text-white/50'}`}>
              {departments[0] || 'N/A'}
            </span>
          </div>
          <div className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${isLight ? 'bg-[#e8f5f5] text-[#247B7B]' : 'bg-primary-500/10 text-primary-400'}`}>
            {totalVisits} visit{totalVisits !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Bottom: View arrow */}
        <div className={`flex items-center justify-between pt-3 border-t ${isLight ? 'border-gray-100' : 'border-white/[0.06]'}`}>
          <div className="flex items-center gap-1.5">
            <QrCode size={11} className={isLight ? 'text-gray-400' : 'text-white/35'} />
            <span className={`text-[10px] ${isLight ? 'text-gray-400' : 'text-white/35'}`}>
              QR scannable
            </span>
          </div>
          <div className={`flex items-center gap-1 text-xs font-medium ${isLight ? 'text-[#247B7B]' : 'text-primary-400'}`}>
            View History
            <ChevronRight size={14} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PatientHistoryCard;
