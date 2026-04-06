import { useState } from 'react';
import { Patient, TriageLevel, Vitals } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeartbeat, FaThermometerHalf, FaTint, FaClock, FaUserMd, FaMapMarkerAlt, FaRedo, FaChevronDown } from 'react-icons/fa';
import { Download, RefreshCw, QrCode } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { useTheme } from '../hooks/contexts/ThemeContext';
import PatientDetailModal from './PatientDetailModal';
import QRModal from './QRCode/QRDisplay';
import ReTriageModal from './ReTriageModal';

interface PatientCardProps {
  patient: Patient;
  onUpdate: () => void;
  isOverlay?: boolean;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  onReTriage?: (patientId: string, updatedData: {
    description?: string;
    vitals?: Vitals;
    triageLevel: TriageLevel;
  }) => void;
}

const PatientCard: React.FC<PatientCardProps> = ({
  patient,
  onUpdate,
  isOverlay = false,
  isExpanded = false,
  onToggleExpand,
  onReTriage,
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQROpen, setIsQROpen] = useState(false);
  const [isReTriageOpen, setIsReTriageOpen] = useState(false);

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: patient.id,
    data: { patient },
  });

  const dndStyle = transform ? {
    transform: CSS.Translate.toString(transform),
    zIndex: isDragging ? 50 : 1,
  } : undefined;

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

  const actionBtnClass = `p-1.5 rounded-lg transition-colors ${isLight
    ? 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
    : 'text-white/30 hover:text-white/60 hover:bg-white/10'
  }`;

  const labelClass = `text-[10px] font-semibold uppercase tracking-wider ${isLight ? 'text-gray-400' : 'text-white/35'
  }`;

  const valueClass = `text-sm ${isLight ? 'text-gray-800' : 'text-white/85'}`;

  const sectionDivider = `border-t ${isLight ? 'border-gray-100' : 'border-white/[0.06]'}`;

  const handleReTriageSubmit = (patientId: string, updatedData: {
    description?: string;
    vitals?: Vitals;
    triageLevel: TriageLevel;
  }) => {
    if (onReTriage) {
      onReTriage(patientId, updatedData);
    }
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={dndStyle}
        {...attributes}
        {...listeners}
        className={isDragging ? 'opacity-80 scale-105 z-50 cursor-grabbing' : 'cursor-grab'}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ y: -2 }}
          className={`
            rounded-xl border-l-[3px] flex flex-col
            transition-all duration-200 pointer-events-auto
            ${severity.borderColor}
            ${isLight
              ? `bg-white border-gray-100 shadow-sm ${isDragging ? 'shadow-xl ring-2 ring-[#247B7B]/30' : 'hover:shadow-md'}`
              : `bg-white/[0.04] border-white/[0.06] ${isDragging ? 'shadow-2xl shadow-primary-500/20 ring-2 ring-primary-500/50 bg-white/[0.08]' : 'hover:bg-white/[0.07]'}`
            }
            ${isExpanded
              ? isLight
                ? 'ring-2 ring-[#247B7B]/20 shadow-lg'
                : 'ring-1 ring-primary-500/30 shadow-lg shadow-primary-500/5'
              : ''
            }
          `}
        >
          {/* ── COLLAPSED STATE: Always visible ── */}
          <div className="p-4 space-y-2">
            {/* Row 1: Name + Chevron */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <h4
                  className={`font-bold text-base leading-snug truncate cursor-pointer ${isLight ? 'text-gray-900' : 'text-white'}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isDragging) return;
                    setIsModalOpen(true);
                  }}
                >
                  {patient.name || 'Unnamed Patient'}
                </h4>
                <span className={`inline-flex flex-shrink-0 px-2 py-0.5 rounded-md text-[10px] font-mono ${isLight ? 'bg-gray-100 text-gray-500' : 'bg-white/8 text-white/40'
                }`}>
                  #{patient.id}
                </span>
              </div>

              {/* Chevron toggle */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onToggleExpand?.();
                }}
                onPointerDown={(e) => e.stopPropagation()}
                className={`p-1.5 rounded-lg transition-all duration-200 flex-shrink-0 ${isLight
                  ? 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                  : 'text-white/30 hover:text-white/60 hover:bg-white/10'
                }`}
                title={isExpanded ? 'Collapse' : 'Expand'}
              >
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <FaChevronDown size={12} />
                </motion.div>
              </button>
            </div>

            {/* Row 2: Compact vitals inline */}
            {patient?.vitals && (
              <div className={`flex items-center gap-3 flex-wrap text-xs ${isLight ? 'text-gray-500' : 'text-white/55'}`}>
                {patient.vitals.bloodPressure && (
                  <span className="flex items-center gap-1">
                    <FaTint size={9} className={isLight ? 'text-red-400' : 'text-red-400/70'} />
                    {patient.vitals.bloodPressure}
                  </span>
                )}
                {patient.vitals.heartRate && (
                  <span className="flex items-center gap-1">
                    <FaHeartbeat size={9} className={isLight ? 'text-pink-400' : 'text-pink-400/70'} />
                    {patient.vitals.heartRate} bpm
                  </span>
                )}
                {patient.vitals.temperature && (
                  <span className="flex items-center gap-1">
                    <FaThermometerHalf size={9} className={isLight ? 'text-orange-400' : 'text-orange-400/70'} />
                    {patient.vitals.temperature}°C
                  </span>
                )}
              </div>
            )}

            {/* Row 3: Doctor */}
            <div className={`flex items-center gap-1.5 text-xs ${isLight ? 'text-gray-500' : 'text-white/50'}`}>
              <FaUserMd size={10} className={isLight ? 'text-[#247B7B]' : 'text-primary-400'} />
              <span>{patient?.assignedStaff || 'Unassigned'}</span>
            </div>
          </div>

          {/* ── EXPANDED STATE: Revealed with animation ── */}
          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 space-y-3">
                  <div className={sectionDivider} />

                  {/* Chief Complaint */}
                  <div>
                    <p className={labelClass}>Chief Complaint</p>
                    <p className={`${valueClass} leading-relaxed mt-0.5`}>
                      {patient.description}
                    </p>
                  </div>

                  {/* Full Vitals */}
                  {patient?.vitals && (
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

                  {/* Location */}
                  <div className="mt-1">
                    <p className={labelClass}>Location</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <FaMapMarkerAlt size={11} className={isLight ? 'text-[#247B7B]' : 'text-primary-400'} />
                      <span className={valueClass}>{patient?.location || 'Processing...'}</span>
                    </div>
                  </div>

                  {/* Time */}
                  <div>
                    <p className={labelClass}>Time</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <FaClock size={10} className={isLight ? 'text-gray-400' : 'text-white/35'} />
                      <span className={`text-sm ${isLight ? 'text-gray-500' : 'text-white/55'}`}>
                        {formatDistanceToNow(new Date(patient.createdAt ?? Date.now()), { addSuffix: true })}
                      </span>
                    </div>
                  </div>

                  {/* Action icons row */}
                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()} onPointerDown={(e) => e.stopPropagation()}>
                    <button className={actionBtnClass} title="Download"><Download size={13} /></button>
                    <button className={actionBtnClass} title="Refresh" onClick={onUpdate}><RefreshCw size={13} /></button>
                    <button
                      onClick={() => setIsQROpen(true)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${isLight
                        ? 'bg-gray-50 text-gray-500 hover:bg-gray-100 border border-gray-200'
                        : 'bg-white/5 text-white/50 hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      <QrCode size={11} />
                      QR
                    </button>
                  </div>

                  {/* ── RE-TRIAGE CTA ── */}
                  <div onPointerDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()}>
                    <div className={sectionDivider} />
                    <button
                      onClick={() => setIsReTriageOpen(true)}
                      className={`w-full mt-3 py-2.5 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 ${isLight
                        ? 'bg-[#e8f5f5] text-[#247B7B] hover:bg-[#d5edec]'
                        : 'bg-primary-600/20 text-primary-300 hover:bg-primary-600/30'
                      }`}
                    >
                      <FaRedo size={10} />
                      Re-triage
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <PatientDetailModal
        patient={patient}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <QRModal
        isOpen={isQROpen}
        onClose={() => setIsQROpen(false)}
        patientId={String(patient.id)}
        patientName={patient.name || 'Unnamed Patient'}
        patientLocation={patient.location}
      />

      <ReTriageModal
        isOpen={isReTriageOpen}
        onClose={() => setIsReTriageOpen(false)}
        patient={patient}
        onSubmit={handleReTriageSubmit}
      />
    </>
  );
};

export default PatientCard;