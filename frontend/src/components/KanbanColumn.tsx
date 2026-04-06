import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { motion } from 'framer-motion';
import { useTheme } from '../hooks/contexts/ThemeContext';
import { Patient, TriageLevel, Vitals } from '../types';
import PatientCard from './PatientCard';
import ReTriageModal from './ReTriageModal';

interface KanbanColumnProps {
  id: string; // The triage level
  title: string;
  icon: React.ElementType;
  color: string;
  bgGradient: string;
  lightBg: string;
  borderColor: string;
  lightBorder: string;
  iconColor: string;
  patients: Patient[];
  onPatientUpdate: () => void;
  idx: number; // for staggered animation
  onReTriage?: (patientId: string, updatedData: {
    description?: string;
    vitals?: Vitals;
    triageLevel: TriageLevel;
  }) => void;
  onDischarge?: (patient: Patient) => void | Promise<void>;
  onHandoff?: (patient: Patient, doctor: string, nurse: string) => void | Promise<void>;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  id,
  title,
  icon: Icon,
  color,
  bgGradient,
  lightBg,
  borderColor,
  lightBorder,
  iconColor,
  patients,
  onPatientUpdate,
  idx,
  onReTriage,
  onDischarge,
  onHandoff,
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  // Accordion state — only one card expanded at a time per column
  const [expandedPatientId, setExpandedPatientId] = useState<string | null>(null);

  // Re-triage modal state
  const [reTriagePatient, setReTriagePatient] = useState<Patient | null>(null);

  const { isOver, setNodeRef } = useDroppable({
    id,
    data: { columnId: id },
  });

  const handleToggleExpand = (patientId: string) => {
    setExpandedPatientId(prev => prev === patientId ? null : patientId);
  };

  const handleOpenReTriage = (patient: Patient) => {
    setReTriagePatient(patient);
  };

  const handleCloseReTriage = () => {
    setReTriagePatient(null);
  };

  const handleReTriageSubmit = (patientId: string, updatedData: {
    description?: string;
    vitals?: Vitals;
    triageLevel: TriageLevel;
  }) => {
    onReTriage?.(patientId, updatedData);
    setReTriagePatient(null);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: idx * 0.1 }}
        ref={setNodeRef}
        className={`glass-card overflow-hidden flex flex-col transition-all duration-200 border-t-4 h-full
          ${isLight ? lightBorder : `border-${color}-500`}
          ${isOver ? (isLight ? 'ring-4 ring-[#247B7B]/20 bg-gray-50' : 'ring-4 ring-primary-500/50 bg-white/5') : ''}
        `}
      >
        <div className={`p-4 border-b flex-shrink-0 transition-colors ${
          isLight
            ? `${isOver ? 'bg-gray-100' : lightBg} ${lightBorder}`
            : `${isOver ? 'bg-primary-900/30' : `bg-gradient-to-r ${bgGradient}`} ${borderColor}`
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon className={`text-xl ${iconColor}`} />
              <h3 className="font-bold text-lg theme-text">{title}</h3>
            </div>
            <span className={`status-badge status-${color}`}>
              {patients.length} patients
            </span>
          </div>
          <p className={`text-xs mt-1 ${isLight ? 'text-[#94a3a3]' : 'text-white/40'}`}>
            {title === 'CRITICAL' && 'Immediate action required'}
            {title === 'URGENT' && 'Monitor closely'}
            {title === 'STANDARD' && 'Safe to wait'}
          </p>
        </div>
        
        <div className="p-3 overflow-y-auto space-y-3 flex-1 min-h-[300px] max-h-[600px]">
          {patients.length === 0 ? (
            <div className={`h-full flex flex-col items-center justify-center py-12 text-sm border-2 border-dashed rounded-xl ${isLight ? 'text-[#b0bfbf] border-gray-200' : 'text-white/30 border-white/10'}`}>
              <p>Drop patient here</p>
            </div>
          ) : (
            patients.map((patient) => (
              <PatientCard
                key={patient.id}
                patient={patient}
                onUpdate={onPatientUpdate}
                isExpanded={expandedPatientId === patient.id}
                onToggleExpand={() => handleToggleExpand(patient.id)}
                onOpenReTriage={() => handleOpenReTriage(patient)}
                onReTriage={onReTriage}
                onDischarge={onDischarge}
                onHandoff={onHandoff}
              />
            ))
          )}
        </div>
      </motion.div>

      {/* Re-triage Modal — rendered at column level */}
      {reTriagePatient && (
        <ReTriageModal
          isOpen={!!reTriagePatient}
          onClose={handleCloseReTriage}
          patient={reTriagePatient}
          onSubmit={handleReTriageSubmit}
        />
      )}
    </>
  );
};

export default KanbanColumn;
