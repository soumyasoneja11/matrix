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

interface PatientCardProps {
  patient: Patient;
  onUpdate: () => void;
  isOverlay?: boolean;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  onOpenReTriage?: () => void;
  onDischarge?: (patient: Patient) => void;
  onHandoff?: (patient: Patient, doctor: string, nurse: string) => void;
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
  onOpenReTriage,
  onDischarge,
  onHandoff,
  onReTriage,
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQROpen, setIsQROpen] = useState(false);

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
        return {
          borderColor: isLight ? 'border-l-red-400' : 'border-l-red-500',
          glowColor: isLight ? 'ring-red-200/60' : 'ring-red-500/25',
        };
      case TriageLevel.URGENT:
        return {
          borderColor: isLight ? 'border-l-amber-400' : 'border-l-amber-500',
          glowColor: isLight ? 'ring-amber-200/60' : 'ring-amber-500/25',
        };
      case TriageLevel.STANDARD:
        return {
          borderColor: isLight ? 'border-l-emerald-400' : 'border-l-emerald-500',
          glowColor: isLight ? 'ring-emerald-200/60' : 'ring-emerald-500/25',
        };
      default:
        return {
          borderColor: isLight ? 'border-l-gray-300' : 'border-l-gray-500',
          glowColor: isLight ? 'ring-gray-200/60' : 'ring-gray-500/25',
        };
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

  // Compact inline vitals for collapsed view
  const compactVitals = () => {
    const parts: string[] = [];
    if (patient.vitals?.bloodPressure) parts.push(`BP ${patient.vitals.bloodPressure}`);
    if (patient.vitals?.heartRate) parts.push(`HR ${patient.vitals.heartRate}`);
    if (patient.vitals?.temperature) parts.push(`${patient.vitals.temperature}°C`);
    return parts;
  };

  const handleChevronClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onToggleExpand?.();
  };

  const handleReTriageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onToggleExpand?.(); // This is handled by KanbanColumn which opens the modal
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
          whileHover={{ y: -2, transition: { duration: 0.2 } }}
          layout
          onClick={(e) => {
            if (isDragging) return;
            setIsModalOpen(true);
          }}
          className={`
            rounded-xl border-l-[3px] flex flex-col
            transition-all duration-300 pointer-events-auto
            ${severity.borderColor}
            ${isExpanded ? `ring-2 ${severity.glowColor}` : ''}
            ${isLight
              ? `bg-white border-gray-100 ${isDragging ? 'shadow-xl ring-2 ring-[#247B7B]/30' : isExpanded ? 'shadow-lg' : 'shadow-sm hover:shadow-md'}`
              : `bg-white/[0.04] border-white/[0.06] ${isDragging ? 'shadow-2xl shadow-primary-500/20 ring-2 ring-primary-500/50 bg-white/[0.08]' : isExpanded ? 'shadow-xl bg-white/[0.06]' : 'hover:bg-white/[0.07]'}`
            }
          `}
        >
          {/* ═══ COLLAPSED STATE: Always visible ═══ */}
          <div className="p-4 space-y-2.5">
            {/* Row 1: Name + Chevron toggle */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <h4 className={`font-bold text-base leading-snug truncate ${isLight ? 'text-gray-900' : 'text-white'}`}>
                  {patient.name || 'Unnamed Patient'}
                </h4>
                <span className={`inline-flex flex-shrink-0 px-1.5 py-0.5 rounded-md text-[9px] font-mono ${isLight ? 'bg-gray-100 text-gray-500' : 'bg-white/8 text-white/40'
                  }`}>
                  #{patient.id?.slice(-6) || patient.id}
                </span>
              </div>
              <button
                onClick={handleChevronClick}
                className={`p-1.5 rounded-lg transition-all duration-300 flex-shrink-0 ${isLight
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
            <div className="flex items-center gap-2 flex-wrap">
              {compactVitals().map((v, i) => (
                <span
                  key={i}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-medium ${isLight ? 'bg-gray-50 text-gray-600 border border-gray-100' : 'bg-white/5 text-white/60 border border-white/[0.06]'
                    }`}
                >
                  {i === 0 && <FaTint size={8} className={isLight ? 'text-red-400' : 'text-red-400/60'} />}
                  {i === 1 && <FaHeartbeat size={8} className={isLight ? 'text-pink-400' : 'text-pink-400/60'} />}
                  {i === 2 && <FaThermometerHalf size={8} className={isLight ? 'text-orange-400' : 'text-orange-400/60'} />}
                  {v}
                </span>
              ))}
            </div>

            {/* Row 3: Assigned Doctor */}
            <div className="flex items-center gap-1.5">
              <FaUserMd size={10} className={isLight ? 'text-[#247B7B]' : 'text-primary-400'} />
              <span className={`text-xs ${isLight ? 'text-gray-600' : 'text-white/60'}`}>
                {patient?.assignedStaff || 'Unassigned'}
              </span>
            </div>
          </div>

          {/* ═══ EXPANDED STATE: Additional detail ═══ */}
          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.div
                key="expanded-content"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{
                  height: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
                  opacity: { duration: 0.25, delay: 0.05 },
                }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 space-y-3">
                  <div className={sectionDivider} />

                  {/* Chief Complaint */}
                  <div>
                    <p className={labelClass}>Chief Complaint</p>
                    <p className={`${valueClass} leading-relaxed mt-0.5`}>
                      {patient.description || patient.chiefComplaint || 'No description available'}
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
                        {patient.vitals.oxygenSaturation && (
                          <div className="flex items-center gap-2">
                            <span className={`text-xs ${isLight ? 'text-blue-400' : 'text-blue-400/70'}`}>O₂</span>
                            <span className={valueClass}>SpO₂: {patient.vitals.oxygenSaturation}%</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Location */}
                  <div>
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
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <button className={actionBtnClass} title="Download"><Download size={13} /></button>
                      <button className={actionBtnClass} title="Refresh" onClick={onUpdate}><RefreshCw size={13} /></button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setIsQROpen(true); }}
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium transition-colors ${isLight
                            ? 'bg-gray-50 text-gray-500 hover:bg-gray-100 border border-gray-200'
                            : 'bg-white/5 text-white/50 hover:bg-white/10 border border-white/10'
                          }`}
                      >
                        <QrCode size={11} />
                        QR
                      </button>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsModalOpen(true);
                      }}
                      className={`text-[11px] font-medium px-2.5 py-1 rounded-lg transition-colors ${isLight
                        ? 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                        : 'text-white/40 hover:text-white/70 hover:bg-white/10'
                        }`}
                    >
                      View Details →
                    </button>
                  </div>

                  {/* ── RE-TRIAGE CTA (bottom, full-width) ── */}
                  <div onPointerDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()}>
                    <div className={sectionDivider} />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenReTriage?.();
                      }}
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
        onDischarge={onDischarge}
        onHandoff={onHandoff}
      />

      <QRModal
        isOpen={isQROpen}
        onClose={() => setIsQROpen(false)}
        patientId={String(patient.id)}
        patientName={patient.name || 'Unnamed Patient'}
        patientLocation={patient.location}
      />
    </>
  );
};

export default PatientCard;