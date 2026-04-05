import { useState } from 'react';
import { Patient, TriageLevel } from '../types';
import { motion } from 'framer-motion';
import { FaHeartbeat, FaThermometerHalf, FaTint, FaClock, FaUserMd, FaMapMarkerAlt, FaRedo } from 'react-icons/fa';
import { Download, RefreshCw, QrCode } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useTheme } from '../hooks/contexts/ThemeContext';
import PatientDetailModal from './PatientDetailModal';

interface PatientCardProps {
  patient: Patient;
  onUpdate: () => void;
}

const PatientCard: React.FC<PatientCardProps> = ({ patient, onUpdate }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getSeverityConfig = () => {
    switch (patient.triageLevel) {
      case TriageLevel.CRITICAL:
        return { borderColor: isLight ? 'border-l-red-400' : 'border-l-red-500' };
      case TriageLevel.URGENT:
        return { borderColor: isLight ? 'border-l-amber-400' : 'border-l-amber-500' };
      case TriageLevel.STANDARD:
        return { borderColor: isLight ? 'border-l-emerald-400' : 'border-l-emerald-500' };
      default:
        return { borderColor: isLight ? 'border-l-gray-300' : 'border-l-gray-500' };
    }
  };

  const severity = getSeverityConfig();

  const actionBtnClass = `p-1.5 rounded-lg transition-colors ${
    isLight
      ? 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
      : 'text-white/30 hover:text-white/60 hover:bg-white/10'
  }`;

  const labelClass = `text-[10px] font-semibold uppercase tracking-wider ${
    isLight ? 'text-gray-400' : 'text-white/35'
  }`;

  const valueClass = `text-sm ${isLight ? 'text-gray-800' : 'text-white/85'}`;

  const sectionDivider = `border-t ${isLight ? 'border-gray-100' : 'border-white/[0.06]'}`;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ y: -2 }}
        onClick={() => setIsModalOpen(true)}
        className={`
          rounded-xl border-l-[3px] cursor-pointer
          transition-all duration-200
          ${severity.borderColor}
          ${isLight
            ? 'bg-white border border-gray-100 shadow-sm hover:shadow-md'
            : 'bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.07]'
          }
        `}
      >
        <div className="p-4 space-y-3">

          {/* ── 1. HEADER ── */}
          {/* Row 1: Full Name + Action Icons */}
          <div className="flex items-start justify-between gap-2">
            <h4 className={`font-bold text-base leading-snug ${isLight ? 'text-gray-900' : 'text-white'}`}>
              {patient.name || 'Unnamed Patient'}
            </h4>
            <div className="flex items-center gap-0.5 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
              <button className={actionBtnClass} title="Download"><Download size={13} /></button>
              <button className={actionBtnClass} title="Refresh" onClick={onUpdate}><RefreshCw size={13} /></button>
            </div>
          </div>

          {/* Row 2: Patient ID pill + Generate QR button */}
          <div className="flex items-center justify-between">
            <span className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-mono ${
              isLight ? 'bg-gray-100 text-gray-500' : 'bg-white/8 text-white/40'
            }`}>
              #{patient.id}
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); }}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                isLight
                  ? 'bg-gray-50 text-gray-500 hover:bg-gray-100 border border-gray-200'
                  : 'bg-white/5 text-white/50 hover:bg-white/10 border border-white/10'
              }`}
            >
              <QrCode size={11} />
              Generate QR
            </button>
          </div>

          {/* ── 2. ACTION ROW ── */}
          <div className={sectionDivider} />
          <button
            onClick={(e) => { e.stopPropagation(); }}
            className={`w-full py-2 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 ${
              isLight
                ? 'bg-[#e8f5f5] text-[#247B7B] hover:bg-[#d5edec]'
                : 'bg-primary-600/20 text-primary-300 hover:bg-primary-600/30'
            }`}
          >
            <FaRedo size={10} />
            Re-triage
          </button>

          {/* ── 3. PRIMARY MEDICAL INFORMATION ── */}
          <div className={sectionDivider} />

          {/* Chief Complaint */}
          <div>
            <p className={labelClass}>Chief Complaint</p>
            <p className={`${valueClass} leading-relaxed mt-0.5`}>
              {patient.description}
            </p>
          </div>

          {/* Vitals */}
          {patient.vitals && (
            <div>
              <p className={labelClass}>Vitals</p>
              <div className="mt-1 space-y-1">
                {patient.vitals.bloodPressure && (
                  <div className="flex items-center gap-2">
                    <FaTint size={10} className={isLight ? 'text-red-400' : 'text-red-400/70'} />
                    <span className={valueClass}>BP: {patient.vitals.bloodPressure}</span>
                  </div>
                )}
                {patient.vitals.heartRate && (
                  <div className="flex items-center gap-2">
                    <FaHeartbeat size={10} className={isLight ? 'text-pink-400' : 'text-pink-400/70'} />
                    <span className={valueClass}>HR: {patient.vitals.heartRate} bpm</span>
                  </div>
                )}
                {patient.vitals.temperature && (
                  <div className="flex items-center gap-2">
                    <FaThermometerHalf size={10} className={isLight ? 'text-orange-400' : 'text-orange-400/70'} />
                    <span className={valueClass}>Temp: {patient.vitals.temperature}°C</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Doctor / Assigned */}
          {patient.assignedStaff && (
            <div>
              <p className={labelClass}>Doctor / Assigned</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <FaUserMd size={11} className={isLight ? 'text-[#247B7B]' : 'text-primary-400'} />
                <span className={valueClass}>{patient.assignedStaff}</span>
              </div>
            </div>
          )}

          {/* Location */}
          {patient.location && (
            <div>
              <p className={labelClass}>Location</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <FaMapMarkerAlt size={11} className={isLight ? 'text-[#247B7B]' : 'text-primary-400'} />
                <span className={valueClass}>{patient.location}</span>
              </div>
            </div>
          )}

          {/* Time */}
          <div>
            <p className={labelClass}>Time</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <FaClock size={10} className={isLight ? 'text-gray-400' : 'text-white/35'} />
              <span className={`text-sm ${isLight ? 'text-gray-500' : 'text-white/55'}`}>
                {formatDistanceToNow(new Date(patient?.createdAt || Date.now()), { addSuffix: true })}
              </span>
            </div>
          </div>

        </div>
      </motion.div>

      <PatientDetailModal
        patient={patient}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default PatientCard;