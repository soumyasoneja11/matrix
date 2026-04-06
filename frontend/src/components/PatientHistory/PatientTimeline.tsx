import React from 'react';
import { PatientHistoryVisit, TriageLevel } from '../../types';
import { useTheme } from '../../hooks/contexts/ThemeContext';
import { motion } from 'framer-motion';
import {
  FaHeartbeat,
  FaThermometerHalf,
  FaTint,
  FaUserMd,
  FaUserNurse,
  FaHospital,
  FaPills,
  FaSyringe,
  FaStickyNote,
} from 'react-icons/fa';

interface PatientTimelineProps {
  visits: PatientHistoryVisit[];
}

const PatientTimeline: React.FC<PatientTimelineProps> = ({ visits }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const getSeverityConfig = (level: string) => {
    switch (level) {
      case TriageLevel.CRITICAL:
        return {
          label: 'CRITICAL',
          dot: isLight ? 'bg-red-500' : 'bg-red-500',
          badge: isLight ? 'bg-red-50 text-red-700 border-red-200' : 'bg-red-500/10 text-red-400 border-red-500/30',
        };
      case TriageLevel.URGENT:
        return {
          label: 'URGENT',
          dot: isLight ? 'bg-amber-500' : 'bg-amber-500',
          badge: isLight ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-amber-500/10 text-amber-400 border-amber-500/30',
        };
      default:
        return {
          label: 'STANDARD',
          dot: isLight ? 'bg-emerald-500' : 'bg-emerald-500',
          badge: isLight ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        };
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'ongoing':
        return isLight
          ? 'bg-blue-50 text-blue-600 border-blue-200'
          : 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'follow-up':
        return isLight
          ? 'bg-purple-50 text-purple-600 border-purple-200'
          : 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      default:
        return isLight
          ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    }
  };

  const sectionLabel = `text-[10px] font-semibold uppercase tracking-wider ${isLight ? 'text-gray-400' : 'text-white/35'}`;
  const valueText = `text-sm ${isLight ? 'text-gray-700' : 'text-white/80'}`;

  return (
    <div className="relative">
      {/* Vertical timeline line */}
      <div className={`absolute left-[15px] top-6 bottom-0 w-px ${isLight ? 'bg-gray-200' : 'bg-white/10'}`} />

      <div className="space-y-6">
        {visits.map((visit, idx) => {
          const severity = getSeverityConfig(visit.triageLevel);
          const visitDate = new Date(visit.date);

          return (
            <motion.div
              key={visit.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.3 }}
              className="relative pl-10"
            >
              {/* Timeline dot */}
              <div className={`absolute left-[10px] top-[22px] w-[11px] h-[11px] rounded-full ring-[3px] ${severity.dot} ${isLight ? 'ring-white' : 'ring-slate-900/80'}`} />

              {/* Visit card */}
              <div className={`glass-card overflow-hidden ${isLight ? '' : 'border-white/10'}`}>
                {/* Visit header */}
                <div className={`px-5 py-4 flex items-start justify-between gap-3 border-b ${isLight ? 'border-gray-100' : 'border-white/[0.06]'}`}>
                  <div className="min-w-0">
                    <h4 className={`font-bold text-base ${isLight ? 'text-gray-900' : 'text-white'}`}>
                      {visit.complaint}
                    </h4>
                    <p className={`text-sm mt-1 ${isLight ? 'text-gray-500' : 'text-white/50'}`}>
                      {visitDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      {' · '}
                      {visitDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${severity.badge}`}>
                      {severity.label}
                    </span>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border capitalize ${getStatusConfig(visit.status)}`}>
                      {visit.status}
                    </span>
                  </div>
                </div>

                {/* Visit body */}
                <div className="px-5 py-4 space-y-4">
                  {/* Symptoms */}
                  {visit.symptoms.length > 0 && (
                    <div>
                      <p className={sectionLabel}>Symptoms</p>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {visit.symptoms.map((symptom, i) => (
                          <span
                            key={i}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium ${isLight
                              ? 'bg-gray-50 text-gray-600 border border-gray-100'
                              : 'bg-white/5 text-white/70 border border-white/10'
                            }`}
                          >
                            {symptom}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Vitals */}
                  {visit.vitals && (
                    <div>
                      <p className={sectionLabel}>Vitals</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-1.5">
                        {visit.vitals.bloodPressure && (
                          <VitalChip icon={<FaTint size={10} />} label="BP" value={visit.vitals.bloodPressure} isLight={isLight} />
                        )}
                        {visit.vitals.heartRate && (
                          <VitalChip icon={<FaHeartbeat size={10} />} label="HR" value={`${visit.vitals.heartRate} bpm`} isLight={isLight} />
                        )}
                        {visit.vitals.temperature && (
                          <VitalChip icon={<FaThermometerHalf size={10} />} label="Temp" value={`${visit.vitals.temperature}°C`} isLight={isLight} />
                        )}
                        {visit.vitals.oxygenSaturation && (
                          <VitalChip icon={<FaHeartbeat size={10} />} label="SpO₂" value={`${visit.vitals.oxygenSaturation}%`} isLight={isLight} />
                        )}
                      </div>
                    </div>
                  )}

                  {/* Assignment Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {visit.assignedDoctor && (
                      <div>
                        <p className={sectionLabel}>Doctor</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <FaUserMd size={11} className={isLight ? 'text-[#247B7B]' : 'text-primary-400'} />
                          <span className={valueText}>{visit.assignedDoctor}</span>
                        </div>
                      </div>
                    )}
                    {visit.assignedNurse && (
                      <div>
                        <p className={sectionLabel}>Nurse</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <FaUserNurse size={11} className={isLight ? 'text-[#247B7B]' : 'text-primary-400'} />
                          <span className={valueText}>{visit.assignedNurse}</span>
                        </div>
                      </div>
                    )}
                    {visit.department && (
                      <div>
                        <p className={sectionLabel}>Department</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <FaHospital size={11} className={isLight ? 'text-[#247B7B]' : 'text-primary-400'} />
                          <span className={valueText}>{visit.department}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Treatment */}
                  {(visit.medicines?.length || visit.procedures?.length) && (
                    <div className={`pt-3 border-t ${isLight ? 'border-gray-100' : 'border-white/[0.06]'}`}>
                      {visit.medicines && visit.medicines.length > 0 && (
                        <div className="mb-3">
                          <p className={`${sectionLabel} flex items-center gap-1.5`}>
                            <FaPills size={9} />
                            Medications
                          </p>
                          <div className="flex flex-wrap gap-1.5 mt-1.5">
                            {visit.medicines.map((med, i) => (
                              <span
                                key={i}
                                className={`px-2.5 py-1 rounded-lg text-xs font-medium ${isLight
                                  ? 'bg-[#e8f5f5] text-[#247B7B] border border-[#247B7B]/15'
                                  : 'bg-primary-500/10 text-primary-300 border border-primary-500/20'
                                }`}
                              >
                                {med}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {visit.procedures && visit.procedures.length > 0 && (
                        <div>
                          <p className={`${sectionLabel} flex items-center gap-1.5`}>
                            <FaSyringe size={9} />
                            Procedures
                          </p>
                          <div className="flex flex-wrap gap-1.5 mt-1.5">
                            {visit.procedures.map((proc, i) => (
                              <span
                                key={i}
                                className={`px-2.5 py-1 rounded-lg text-xs font-medium ${isLight
                                  ? 'bg-purple-50 text-purple-600 border border-purple-100'
                                  : 'bg-purple-500/10 text-purple-300 border border-purple-500/20'
                                }`}
                              >
                                {proc}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Notes */}
                  {visit.notes && (
                    <div className={`pt-3 border-t ${isLight ? 'border-gray-100' : 'border-white/[0.06]'}`}>
                      <p className={`${sectionLabel} flex items-center gap-1.5`}>
                        <FaStickyNote size={9} />
                        Clinical Notes
                      </p>
                      <p className={`mt-1.5 text-sm leading-relaxed ${isLight ? 'text-gray-600' : 'text-white/65'}`}>
                        {visit.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

/* ── Sub-component ── */
function VitalChip({ icon, label, value, isLight }: { icon: React.ReactNode; label: string; value: string; isLight: boolean }) {
  return (
    <div className={`px-3 py-2 rounded-lg ${isLight ? 'bg-gray-50 border border-gray-100' : 'bg-white/5 border border-white/10'}`}>
      <div className={`flex items-center gap-1 mb-0.5 ${isLight ? 'text-gray-400' : 'text-white/40'}`}>
        {icon}
        <span className="text-[10px] font-medium uppercase tracking-wider">{label}</span>
      </div>
      <p className={`text-sm font-semibold tabular-nums ${isLight ? 'text-gray-800' : 'text-white'}`}>{value}</p>
    </div>
  );
}

export default PatientTimeline;
