import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useTheme } from '../hooks/contexts/ThemeContext';
import { FaExchangeAlt, FaUserMd, FaUserNurse } from 'react-icons/fa';
import { Patient, Staff } from '../types';
import { staffAPI } from '../services/api';

interface HandoffModalProps {
  isOpen: boolean;
  onConfirm: (doctorName: string, nurseName: string) => void;
  onCancel: () => void;
  patient: Patient;
}

// Fallback staff data when API is unavailable
const FALLBACK_DOCTORS = [
  { id: 'doc1', fullName: 'Dr. Sarah Chen', role: 'DOCTOR' },
  { id: 'doc2', fullName: 'Dr. James Wilson', role: 'DOCTOR' },
  { id: 'doc3', fullName: 'Dr. Priya Sharma', role: 'DOCTOR' },
  { id: 'doc4', fullName: 'Dr. Michael Torres', role: 'DOCTOR' },
  { id: 'doc5', fullName: 'Dr. Emily Zhang', role: 'DOCTOR' },
];

const FALLBACK_NURSES = [
  { id: 'nur1', fullName: 'Nurse Rodriguez', role: 'NURSE' },
  { id: 'nur2', fullName: 'Nurse Thompson', role: 'NURSE' },
  { id: 'nur3', fullName: 'Nurse Patel', role: 'NURSE' },
  { id: 'nur4', fullName: 'Nurse O\'Brien', role: 'NURSE' },
  { id: 'nur5', fullName: 'Nurse Kim', role: 'NURSE' },
];

const HandoffModal: React.FC<HandoffModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  patient,
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [doctors, setDoctors] = useState<{ id: string; fullName: string }[]>(FALLBACK_DOCTORS);
  const [nurses, setNurses] = useState<{ id: string; fullName: string }[]>(FALLBACK_NURSES);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedNurse, setSelectedNurse] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch staff list
  useEffect(() => {
    if (!isOpen) return;

    const fetchStaff = async () => {
      try {
        const res = await staffAPI.getAll();
        const staff: Staff[] = res.data;
        if (staff && staff.length > 0) {
          const docs = staff.filter(s =>
            s.role === 'DOCTOR' || s.role === 'SURGEON'
          ).map(s => ({ id: s.id, fullName: s.fullName }));
          const nurs = staff.filter(s =>
            s.role === 'NURSE'
          ).map(s => ({ id: s.id, fullName: s.fullName }));

          if (docs.length > 0) setDoctors(docs);
          if (nurs.length > 0) setNurses(nurs);
        }
      } catch {
        // Use fallback data — already set as default
      }
    };

    fetchStaff();
  }, [isOpen]);

  // Pre-fill current assignments when modal opens
  useEffect(() => {
    if (!isOpen) return;

    const currentDoc = patient.assignedDoctor || patient.assignedStaff || '';
    const currentNurse = patient.assignedNurse || '';

    setSelectedDoctor(currentDoc);
    setSelectedNurse(currentNurse);
  }, [isOpen, patient]);

  const canSubmit = selectedDoctor.trim() !== '' && selectedNurse.trim() !== '';

  const handleConfirm = async () => {
    if (!canSubmit || isSubmitting) return;
    setIsSubmitting(true);

    try {
      onConfirm(selectedDoctor, selectedNurse);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setSelectedDoctor('');
    setSelectedNurse('');
    onCancel();
  };

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleCancel();
    };
    if (isOpen) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen]);

  const selectClass = `w-full px-4 py-2.5 rounded-xl border transition-all duration-200 cursor-pointer
    focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-primary-500
    appearance-none ${
      isLight
        ? 'bg-gray-100 border-gray-300 text-gray-900'
        : 'bg-[#2A2A40] border-gray-600 text-gray-200'
    }`;

  const labelClass = `block text-sm font-semibold mb-1.5 ${
    isLight ? 'text-gray-700' : 'text-gray-300'
  }`;

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleCancel}
          className={`absolute inset-0 backdrop-blur-sm ${
            isLight ? 'bg-gray-900/40' : 'bg-black/60'
          }`}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className={`relative w-full max-w-lg rounded-2xl shadow-xl border overflow-hidden ${
            isLight
              ? 'bg-white border-gray-200'
              : 'glass-card border-white/10'
          }`}
        >
          {/* Decorative glow */}
          {!isLight && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-primary-500/10 blur-[40px] pointer-events-none rounded-full" />
          )}

          {/* Header */}
          <div className={`px-6 py-4 flex items-center justify-between border-b ${
            isLight ? 'border-gray-100' : 'border-white/10'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${
                isLight ? 'bg-blue-100 text-blue-600' : 'bg-blue-500/20 text-blue-400'
              }`}>
                <FaExchangeAlt size={18} />
              </div>
              <div>
                <h3 className={`text-lg font-bold ${isLight ? 'text-gray-900' : 'text-white'}`}>
                  Handoff Patient
                </h3>
                <p className={`text-xs ${isLight ? 'text-gray-500' : 'text-white/50'}`}>
                  Transfer care for {patient.name || 'Unnamed Patient'}
                </p>
              </div>
            </div>
            <button
              onClick={handleCancel}
              className={`p-1.5 rounded-lg transition-colors ${
                isLight ? 'hover:bg-gray-100 text-gray-400' : 'hover:bg-white/10 text-white/40'
              }`}
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-5 space-y-5">
            {/* Doctor Selection */}
            <div>
              <label className={labelClass}>
                <span className="flex items-center gap-1.5">
                  <FaUserMd size={13} className={isLight ? 'text-[#247B7B]' : 'text-primary-400'} />
                  Assign Doctor <span className="text-red-400">*</span>
                </span>
              </label>
              <div className="relative">
                <select
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  className={selectClass}
                >
                  <option value="">Select a doctor...</option>
                  {doctors.map(doc => (
                    <option key={doc.id} value={doc.fullName}>
                      {doc.fullName}
                    </option>
                  ))}
                </select>
                <div className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${
                  isLight ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Nurse Selection */}
            <div>
              <label className={labelClass}>
                <span className="flex items-center gap-1.5">
                  <FaUserNurse size={13} className={isLight ? 'text-[#247B7B]' : 'text-primary-400'} />
                  Assign Nurse <span className="text-red-400">*</span>
                </span>
              </label>
              <div className="relative">
                <select
                  value={selectedNurse}
                  onChange={(e) => setSelectedNurse(e.target.value)}
                  className={selectClass}
                >
                  <option value="">Select a nurse...</option>
                  {nurses.map(nur => (
                    <option key={nur.id} value={nur.fullName}>
                      {nur.fullName}
                    </option>
                  ))}
                </select>
                <div className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${
                  isLight ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Current Assignment Info */}
            <div className={`p-3 rounded-xl text-xs ${
              isLight ? 'bg-gray-50 border border-gray-100 text-gray-500' : 'bg-white/5 border border-white/10 text-white/40'
            }`}>
              <p className="font-medium mb-1">Current Assignment</p>
              <p>Doctor: {patient.assignedDoctor || patient.assignedStaff || 'Unassigned'}</p>
              <p>Nurse: {patient.assignedNurse || 'Unassigned'}</p>
            </div>
          </div>

          {/* Footer */}
          <div className={`px-6 py-4 flex items-center justify-end gap-3 border-t ${
            isLight ? 'border-gray-100' : 'border-white/10'
          }`}>
            <button
              onClick={handleCancel}
              disabled={isSubmitting}
              className={`px-5 py-2.5 rounded-xl font-semibold transition-all ${
                isLight
                  ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
              } disabled:opacity-50`}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!canSubmit || isSubmitting}
              className={`px-5 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                isLight
                  ? 'bg-[#247B7B] hover:bg-[#1a5c5c] text-white shadow-md'
                  : 'bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-500/20'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Transferring...
                </>
              ) : (
                <>
                  <FaExchangeAlt size={13} />
                  Confirm Handoff
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
};

export default HandoffModal;
