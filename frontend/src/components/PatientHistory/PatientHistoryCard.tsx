import React, { useState } from 'react';
import { PatientHistoryRecord, TriageLevel } from '../../types';
import { useTheme } from '../../hooks/contexts/ThemeContext';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaHospital } from 'react-icons/fa';
import { QrCode, ChevronRight } from 'lucide-react';
import QRModal from '../QRCode/QRDisplay';

interface PatientHistoryCardProps {
  patient: PatientHistoryRecord;
  index: number;
  onClick: () => void;
}

const PatientHistoryCard: React.FC<PatientHistoryCardProps> = ({ patient, index, onClick }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [isQROpen, setIsQROpen] = useState(false);

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

  const status = getStatusBadge();
  const labelClass = `text-[10px] font-semibold uppercase tracking-wider ${isLight ? 'text-gray-400' : 'text-white/35'}`;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.08, duration: 0.3 }}
        whileHover={{ y: -3 }}
        onClick={onClick}
        className={`
          glass-card border-l-[3px] cursor-pointer transition-all duration-200
          ${getLatestSeverityBorder()}
          ${isLight
            ? 'hover:shadow-md'
            : 'hover:bg-white/[0.07]'
          }
        `}
      >
        <div className="p-5 space-y-4">
          {/* Header: Name + Status */}
          <div className="flex items-start justify-between gap-3">
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

          {/* Bottom: QR + View arrow */}
          <div className={`flex items-center justify-between pt-3 border-t ${isLight ? 'border-gray-100' : 'border-white/[0.06]'}`}>
            <button
              onClick={(e) => { e.stopPropagation(); setIsQROpen(true); }}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${isLight
                ? 'bg-gray-50 text-gray-500 hover:bg-gray-100 border border-gray-200'
                : 'bg-white/5 text-white/50 hover:bg-white/10 border border-white/10'
              }`}
            >
              <QrCode size={11} />
              QR Code
            </button>
            <div className={`flex items-center gap-1 text-xs font-medium ${isLight ? 'text-[#247B7B]' : 'text-primary-400'}`}>
              View History
              <ChevronRight size={14} />
            </div>
          </div>
        </div>
      </motion.div>

      <QRModal
        isOpen={isQROpen}
        onClose={() => setIsQROpen(false)}
        patientId={String(patient.id)}
        patientName={patient.name}
      />
    </>
  );
};

export default PatientHistoryCard;
