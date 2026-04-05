import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Patient, TriageLevel } from '../types';
import { useTheme } from '../hooks/contexts/ThemeContext';
import { FaHeartbeat, FaThermometerHalf, FaTint, FaSignOutAlt, FaExchangeAlt } from 'react-icons/fa';

interface PatientDetailModalProps {
  patient: Patient;
  isOpen: boolean;
  onClose: () => void;
}

const PatientDetailModal: React.FC<PatientDetailModalProps> = ({ patient, isOpen, onClose }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const getSeverityConfig = () => {
    switch (patient.triageLevel) {
      case TriageLevel.CRITICAL:
        return {
          label: 'CRITICAL',
          bg: isLight ? 'bg-red-50' : 'bg-red-500/10',
          text: isLight ? 'text-red-700' : 'text-red-400',
          border: isLight ? 'border-red-200' : 'border-red-500/30',
          dot: 'bg-red-500',
        };
      case TriageLevel.URGENT:
        return {
          label: 'URGENT',
          bg: isLight ? 'bg-amber-50' : 'bg-amber-500/10',
          text: isLight ? 'text-amber-700' : 'text-amber-400',
          border: isLight ? 'border-amber-200' : 'border-amber-500/30',
          dot: 'bg-amber-500',
        };
      case TriageLevel.STANDARD:
        return {
          label: 'STANDARD',
          bg: isLight ? 'bg-emerald-50' : 'bg-emerald-500/10',
          text: isLight ? 'text-emerald-700' : 'text-emerald-400',
          border: isLight ? 'border-emerald-200' : 'border-emerald-500/30',
          dot: 'bg-emerald-500',
        };
      default:
        return {
          label: 'UNKNOWN',
          bg: isLight ? 'bg-gray-50' : 'bg-gray-500/10',
          text: isLight ? 'text-gray-700' : 'text-gray-400',
          border: isLight ? 'border-gray-200' : 'border-gray-500/30',
          dot: 'bg-gray-500',
        };
    }
  };

  const severity = getSeverityConfig();
  const createdDateStr = patient?.createdAt || patient?.updatedAt || new Date().toISOString();
  const createdDate = new Date(createdDateStr);

  const triageRationale: Record<string, { text: string; confidence: number }> = {
    CRITICAL: { text: 'Patient presents with high-acuity symptoms requiring immediate intervention. Vital signs indicate hemodynamic instability.', confidence: 92 },
    URGENT: { text: 'Patient requires timely evaluation. Symptoms suggest moderate severity with potential for deterioration if untreated.', confidence: 87 },
    STANDARD: { text: 'Patient is hemodynamically stable with low-acuity presentation. Safe to monitor in general waiting area.', confidence: 94 },
  };

  const rationale = triageRationale[patient.triageLevel] || triageRationale.STANDARD;

  const sectionHeading = `text-[11px] font-semibold uppercase tracking-wider mb-2 ${
    isLight ? 'text-gray-400' : 'text-white/40'
  }`;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal — flex column with max-height for both themes */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className={`
              relative w-full max-w-4xl z-10
              flex flex-col
              rounded-2xl shadow-2xl
              ${isLight ? 'bg-white' : 'bg-slate-900 border border-white/10'}
            `}
            style={{ maxHeight: '90vh' }}
          >
            {/* ── Sticky Header ── */}
            <div className={`
              flex-shrink-0 px-6 py-4 flex items-center justify-between border-b
              ${isLight ? 'bg-white border-gray-100 rounded-t-2xl' : 'bg-slate-900 border-white/10 rounded-t-2xl'}
            `}>
              <div className="flex items-center gap-3 min-w-0">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className={`text-xl font-bold truncate ${isLight ? 'text-gray-900' : 'text-white'}`}>
                      {patient.name || 'Unnamed Patient'}
                    </h2>
                    <span className={`flex-shrink-0 px-2 py-0.5 rounded-md text-[10px] font-mono ${
                      isLight ? 'bg-gray-100 text-gray-500' : 'bg-white/10 text-white/50'
                    }`}>
                      ID-{patient.id}
                    </span>
                  </div>
                  <p className={`text-sm mt-0.5 ${isLight ? 'text-gray-500' : 'text-white/50'}`}>
                    Age {patient?.age || 'N/A'} · {patient?.location || 'Unassigned'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${severity.bg} ${severity.text} ${severity.border}`}>
                  {severity.label}
                </span>
                <button
                  onClick={onClose}
                  className={`p-1.5 rounded-lg transition-colors ${
                    isLight ? 'hover:bg-gray-100 text-gray-400' : 'hover:bg-white/10 text-white/40'
                  }`}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* ── Scrollable Content ── */}
            <div className="flex-1 overflow-y-auto min-h-0">
              <div className="px-6 py-5 space-y-6">

                {/* A. Chief Complaint */}
                <section>
                  <h3 className={sectionHeading}>Chief Complaint</h3>
                  <p className={`text-base font-medium ${isLight ? 'text-gray-800' : 'text-white/90'}`}>
                    {patient.description?.split('.')[0] || 'No complaint recorded'}
                  </p>
                </section>

                {/* B. Vitals */}
                {patient.vitals && (
                  <section>
                    <h3 className={`${sectionHeading} flex items-center gap-1.5`}>
                      <FaHeartbeat className="text-red-400" size={12} />
                      Vitals
                    </h3>
                    <div className="grid grid-cols-3 gap-3">
                      <VitalChip
                        icon={<FaTint size={11} />}
                        label="Blood Pressure"
                        value={patient.vitals.bloodPressure || '--'}
                        isLight={isLight}
                      />
                      <VitalChip
                        icon={<FaHeartbeat size={11} />}
                        label="Heart Rate"
                        value={patient.vitals.heartRate ? `${patient.vitals.heartRate} bpm` : '--'}
                        isLight={isLight}
                      />
                      <VitalChip
                        icon={<FaThermometerHalf size={11} />}
                        label="Temperature"
                        value={patient.vitals.temperature ? `${patient.vitals.temperature}°C` : '--'}
                        isLight={isLight}
                      />
                    </div>
                  </section>
                )}

                {/* C. Raw Intake Input */}
                <section>
                  <h3 className={sectionHeading}>Raw Intake Input</h3>
                  <div className={`px-4 py-3 rounded-xl text-sm font-mono leading-relaxed break-words whitespace-pre-wrap ${
                    isLight ? 'bg-gray-50 text-gray-600 border border-gray-100' : 'bg-white/5 text-white/70 border border-white/10'
                  }`}>
                    "{patient.description}"
                  </div>
                </section>

                {/* D. Intake Timestamp */}
                <section>
                  <h3 className={sectionHeading}>Intake Timestamp</h3>
                  <p className={`text-sm ${isLight ? 'text-gray-700' : 'text-white/80'}`}>
                    {createdDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    {' · '}
                    {createdDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </p>
                </section>

                {/* E. Event Timeline */}
                <section>
                  <h3 className={sectionHeading}>Event Timeline</h3>
                  <div className="relative pl-5">
                    {/* Vertical line */}
                    <div className={`absolute left-[7px] top-1 bottom-1 w-px ${isLight ? 'bg-gray-200' : 'bg-white/10'}`} />

                    <TimelineItem
                      label="Intake"
                      desc="Patient admitted via voice triage"
                      time={createdDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      actor="System"
                      isLight={isLight}
                      dotColor="bg-blue-500"
                    />
                    <TimelineItem
                      label="AI Triage"
                      desc={`Classified as ${patient.triageLevel}`}
                      time={createdDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      actor="VitalPass AI"
                      isLight={isLight}
                      dotColor={severity.dot}
                    />
                    {(patient?.assignedStaff || patient?.assignedDoctorId || patient?.assignedNurseId) && (
                      <TimelineItem
                        label="Assignment"
                        desc={`Assigned to ${patient?.assignedStaff || patient?.assignedDoctorId || patient?.assignedNurseId}`}
                        time={new Date(patient?.updatedAt || Date.now()).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        actor="System"
                        isLight={isLight}
                        dotColor="bg-purple-500"
                        isLast
                      />
                    )}
                  </div>
                </section>

                {/* F. AI Triage Rationale */}
                <section>
                  <h3 className={sectionHeading}>AI Triage Rationale</h3>
                  <p className={`text-sm leading-relaxed mb-3 ${isLight ? 'text-gray-600' : 'text-white/70'}`}>
                    {rationale.text}
                  </p>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-medium ${isLight ? 'text-gray-500' : 'text-white/50'}`}>
                      Confidence
                    </span>
                    <div className={`flex-1 h-2 rounded-full overflow-hidden ${isLight ? 'bg-gray-100' : 'bg-white/10'}`}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${rationale.confidence}%` }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className={`h-full rounded-full ${
                          patient.triageLevel === TriageLevel.CRITICAL ? 'bg-red-500' :
                          patient.triageLevel === TriageLevel.URGENT ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                      />
                    </div>
                    <span className={`text-xs font-bold tabular-nums ${isLight ? 'text-gray-700' : 'text-white/80'}`}>
                      {rationale.confidence}%
                    </span>
                  </div>
                </section>
              </div>
            </div>

            {/* ── Sticky Footer Actions ── */}
            <div className={`
              flex-shrink-0 px-6 py-4 flex items-center justify-between border-t
              ${isLight ? 'bg-white border-gray-100 rounded-b-2xl' : 'bg-slate-900 border-white/10 rounded-b-2xl'}
            `}>
              <div className="flex gap-2">
                <button className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  isLight
                    ? 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                    : 'bg-white/5 text-white/80 hover:bg-white/10 border border-white/10'
                }`}>
                  <FaSignOutAlt size={13} />
                  Discharge
                </button>
                <button className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  isLight
                    ? 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                    : 'bg-white/5 text-white/80 hover:bg-white/10 border border-white/10'
                }`}>
                  <FaExchangeAlt size={13} />
                  Handoff
                </button>
              </div>

              {/* Status Badge */}
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${severity.bg} ${severity.text} ${severity.border}`}>
                {severity.label}
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

/* ── Sub-components ── */

function VitalChip({ icon, label, value, isLight }: { icon: React.ReactNode; label: string; value: string; isLight: boolean }) {
  return (
    <div className={`px-3 py-2.5 rounded-xl ${
      isLight ? 'bg-gray-50 border border-gray-100' : 'bg-white/5 border border-white/10'
    }`}>
      <div className={`flex items-center gap-1.5 mb-1 ${isLight ? 'text-gray-400' : 'text-white/40'}`}>
        {icon}
        <span className="text-[10px] font-medium uppercase tracking-wider">{label}</span>
      </div>
      <p className={`text-sm font-semibold tabular-nums ${isLight ? 'text-gray-800' : 'text-white'}`}>{value}</p>
    </div>
  );
}

function TimelineItem({ label, desc, time, actor, isLight, dotColor, isLast = false }: {
  label: string; desc: string; time: string; actor: string; isLight: boolean; dotColor: string; isLast?: boolean;
}) {
  return (
    <div className={`relative flex gap-3 ${isLast ? '' : 'pb-4'}`}>
      <div className={`absolute left-[-15px] top-[5px] w-[9px] h-[9px] rounded-full ring-2 ${dotColor} ${
        isLight ? 'ring-white' : 'ring-slate-900'
      }`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className={`text-sm font-semibold ${isLight ? 'text-gray-800' : 'text-white/90'}`}>{label}</span>
          <span className={`text-[11px] tabular-nums ${isLight ? 'text-gray-400' : 'text-white/40'}`}>{time}</span>
        </div>
        <p className={`text-xs mt-0.5 ${isLight ? 'text-gray-500' : 'text-white/50'}`}>{desc}</p>
        <p className={`text-[10px] mt-0.5 ${isLight ? 'text-gray-400' : 'text-white/30'}`}>{actor}</p>
      </div>
    </div>
  );
}

export default PatientDetailModal;
