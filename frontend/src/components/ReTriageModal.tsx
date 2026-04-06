import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';
import { FaHeartbeat, FaThermometerHalf, FaTint, FaRedo } from 'react-icons/fa';
import { Patient, TriageLevel, Vitals } from '../types';
import { useTheme } from '../hooks/contexts/ThemeContext';

interface ReTriageModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient;
  onSubmit: (patientId: string, updatedData: {
    description?: string;
    vitals?: Vitals;
    triageLevel: TriageLevel;
  }) => void;
}

interface FormErrors {
  symptoms?: string;
  bloodPressure?: string;
  heartRate?: string;
  temperature?: string;
}

/**
 * Mock triage-level recalculation based on vitals.
 * Returns CRITICAL / URGENT / STANDARD depending on severity.
 */
function recalculatePriority(vitals: Vitals): TriageLevel {
  let score = 0;

  // Heart rate scoring
  if (vitals.heartRate) {
    if (vitals.heartRate > 120 || vitals.heartRate < 50) score += 3;
    else if (vitals.heartRate > 100 || vitals.heartRate < 60) score += 1;
  }

  // Temperature scoring
  if (vitals.temperature) {
    if (vitals.temperature >= 39.5 || vitals.temperature <= 35) score += 3;
    else if (vitals.temperature >= 38.5 || vitals.temperature <= 36) score += 1;
  }

  // Blood pressure scoring (systolic)
  if (vitals.bloodPressure) {
    const systolic = parseInt(vitals.bloodPressure.split('/')[0], 10);
    if (!isNaN(systolic)) {
      if (systolic >= 180 || systolic <= 80) score += 3;
      else if (systolic >= 140 || systolic <= 90) score += 1;
    }
  }

  // Oxygen saturation scoring
  if (vitals.oxygenSaturation) {
    if (vitals.oxygenSaturation < 90) score += 3;
    else if (vitals.oxygenSaturation < 94) score += 1;
  }

  if (score >= 5) return TriageLevel.CRITICAL;
  if (score >= 2) return TriageLevel.URGENT;
  return TriageLevel.STANDARD;
}

const ReTriageModal: React.FC<ReTriageModalProps> = ({ isOpen, onClose, patient, onSubmit }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  // Form state
  const [symptoms, setSymptoms] = useState('');
  const [bloodPressure, setBP] = useState('');
  const [heartRate, setHR] = useState('');
  const [temperature, setTemp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // Pre-fill on open
  useEffect(() => {
    if (isOpen) {
      setSymptoms(patient.description || patient.chiefComplaint || '');
      setBP(patient.vitals?.bloodPressure || '');
      setHR(patient.vitals?.heartRate?.toString() || '');
      setTemp(patient.vitals?.temperature?.toString() || '');
      setErrors({});
      setIsSubmitting(false);
    }
  }, [isOpen, patient]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Prevent body scroll
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const validate = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!symptoms.trim()) {
      newErrors.symptoms = 'Symptoms are required';
    }
    if (!bloodPressure.trim()) {
      newErrors.bloodPressure = 'Blood pressure is required';
    } else if (!/^\d{2,3}\/\d{2,3}$/.test(bloodPressure.trim())) {
      newErrors.bloodPressure = 'Format: 120/80';
    }
    if (!heartRate.trim()) {
      newErrors.heartRate = 'Heart rate is required';
    } else {
      const hr = Number(heartRate);
      if (isNaN(hr) || hr < 20 || hr > 300) {
        newErrors.heartRate = 'Enter 20–300 bpm';
      }
    }
    if (!temperature.trim()) {
      newErrors.temperature = 'Temperature is required';
    } else {
      const temp = Number(temperature);
      if (isNaN(temp) || temp < 30 || temp > 45) {
        newErrors.temperature = 'Enter 30–45°C';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [symptoms, bloodPressure, heartRate, temperature]);

  const isFormValid = symptoms.trim() &&
    bloodPressure.trim() && /^\d{2,3}\/\d{2,3}$/.test(bloodPressure.trim()) &&
    heartRate.trim() && !isNaN(Number(heartRate)) && Number(heartRate) >= 20 && Number(heartRate) <= 300 &&
    temperature.trim() && !isNaN(Number(temperature)) && Number(temperature) >= 30 && Number(temperature) <= 45;

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsSubmitting(true);

    // Simulate processing delay for UX
    await new Promise(res => setTimeout(res, 800));

    const updatedVitals: Vitals = {
      bloodPressure: bloodPressure.trim(),
      heartRate: Number(heartRate),
      temperature: Number(temperature),
      oxygenSaturation: patient.vitals?.oxygenSaturation,
    };

    const newTriageLevel = recalculatePriority(updatedVitals);

    onSubmit(patient.id, {
      description: symptoms.trim(),
      vitals: updatedVitals,
      triageLevel: newTriageLevel,
    });

    setIsSubmitting(false);
    onClose();
  };

  // Shared style helpers
  const inputBase = `w-full px-4 py-3 rounded-xl text-sm transition-all duration-200 outline-none border ${
    isLight
      ? 'bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 focus:border-[#247B7B] focus:ring-2 focus:ring-[#247B7B]/20'
      : 'bg-white/5 border-white/10 text-white placeholder-white/30 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'
  }`;

  const errorInputBorder = isLight
    ? 'border-red-400 focus:border-red-500 focus:ring-red-400/20'
    : 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20';

  const labelClass = `block text-xs font-semibold uppercase tracking-wider mb-2 ${
    isLight ? 'text-gray-500' : 'text-white/50'
  }`;

  const errorTextClass = 'text-xs text-red-500 mt-1 flex items-center gap-1';

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`absolute inset-0 backdrop-blur-sm ${
              isLight ? 'bg-black/20' : 'bg-black/50'
            }`}
            onClick={onClose}
          />

          {/* Modal Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`relative w-full max-w-lg z-10 rounded-2xl shadow-2xl border overflow-hidden ${
              isLight
                ? 'bg-white border-gray-200/60 shadow-gray-300/30'
                : 'bg-[#1E1E2F] border-white/10 shadow-black/50'
            }`}
          >
            {/* Header */}
            <div className={`px-6 py-5 border-b flex items-center justify-between ${
              isLight ? 'border-gray-100 bg-white' : 'border-white/10 bg-[#1E1E2F]'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${
                  isLight ? 'bg-[#e8f5f5] text-[#247B7B]' : 'bg-primary-600/20 text-primary-400'
                }`}>
                  <FaRedo size={14} />
                </div>
                <div>
                  <h3 className={`text-lg font-bold ${isLight ? 'text-gray-900' : 'text-white'}`}>
                    Re-triage Patient
                  </h3>
                  <p className={`text-xs mt-0.5 ${isLight ? 'text-gray-500' : 'text-white/50'}`}>
                    {patient.name} · #{patient.id}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className={`p-2 rounded-xl transition-colors ${
                  isLight
                    ? 'hover:bg-gray-100 text-gray-400 hover:text-gray-600'
                    : 'hover:bg-white/10 text-white/40 hover:text-white/70'
                }`}
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-5 max-h-[60vh] overflow-y-auto">
              {/* Symptoms */}
              <div>
                <label className={labelClass}>
                  Symptoms / Chief Complaint
                </label>
                <textarea
                  value={symptoms}
                  onChange={(e) => { setSymptoms(e.target.value); setErrors(prev => ({ ...prev, symptoms: undefined })); }}
                  placeholder="Update patient symptoms..."
                  rows={4}
                  className={`${inputBase} resize-none ${errors.symptoms ? errorInputBorder : ''}`}
                />
                {errors.symptoms && (
                  <p className={errorTextClass}>
                    <AlertTriangle size={11} /> {errors.symptoms}
                  </p>
                )}
              </div>

              {/* Vitals Grid */}
              <div>
                <label className={labelClass}>Vitals</label>
                <div className="grid grid-cols-3 gap-3">
                  {/* Blood Pressure */}
                  <div>
                    <div className={`flex items-center gap-1.5 mb-1.5 ${isLight ? 'text-gray-400' : 'text-white/40'}`}>
                      <FaTint size={10} />
                      <span className="text-[10px] font-medium uppercase tracking-wider">BP</span>
                    </div>
                    <input
                      type="text"
                      value={bloodPressure}
                      onChange={(e) => { setBP(e.target.value); setErrors(prev => ({ ...prev, bloodPressure: undefined })); }}
                      placeholder="120/80"
                      className={`${inputBase} ${errors.bloodPressure ? errorInputBorder : ''}`}
                    />
                    {errors.bloodPressure && (
                      <p className={errorTextClass}>
                        <AlertTriangle size={10} /> {errors.bloodPressure}
                      </p>
                    )}
                  </div>

                  {/* Heart Rate */}
                  <div>
                    <div className={`flex items-center gap-1.5 mb-1.5 ${isLight ? 'text-gray-400' : 'text-white/40'}`}>
                      <FaHeartbeat size={10} />
                      <span className="text-[10px] font-medium uppercase tracking-wider">HR</span>
                    </div>
                    <input
                      type="number"
                      value={heartRate}
                      onChange={(e) => { setHR(e.target.value); setErrors(prev => ({ ...prev, heartRate: undefined })); }}
                      placeholder="80"
                      min={20}
                      max={300}
                      className={`${inputBase} ${errors.heartRate ? errorInputBorder : ''}`}
                    />
                    {errors.heartRate && (
                      <p className={errorTextClass}>
                        <AlertTriangle size={10} /> {errors.heartRate}
                      </p>
                    )}
                  </div>

                  {/* Temperature */}
                  <div>
                    <div className={`flex items-center gap-1.5 mb-1.5 ${isLight ? 'text-gray-400' : 'text-white/40'}`}>
                      <FaThermometerHalf size={10} />
                      <span className="text-[10px] font-medium uppercase tracking-wider">Temp</span>
                    </div>
                    <input
                      type="number"
                      value={temperature}
                      onChange={(e) => { setTemp(e.target.value); setErrors(prev => ({ ...prev, temperature: undefined })); }}
                      placeholder="37.0"
                      step={0.1}
                      min={30}
                      max={45}
                      className={`${inputBase} ${errors.temperature ? errorInputBorder : ''}`}
                    />
                    {errors.temperature && (
                      <p className={errorTextClass}>
                        <AlertTriangle size={10} /> {errors.temperature}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Current priority indicator */}
              <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm ${
                isLight ? 'bg-gray-50 border border-gray-100' : 'bg-white/5 border border-white/10'
              }`}>
                <span className={`text-xs font-medium ${isLight ? 'text-gray-500' : 'text-white/50'}`}>
                  Current Priority:
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  patient.triageLevel === TriageLevel.CRITICAL
                    ? isLight ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-red-500/10 text-red-400 border border-red-500/30'
                    : patient.triageLevel === TriageLevel.URGENT
                    ? isLight ? 'bg-amber-50 text-amber-600 border border-amber-200' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    : isLight ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {patient.triageLevel}
                </span>
                <span className={`text-xs ${isLight ? 'text-gray-400' : 'text-white/30'}`}>
                  → New priority will be recalculated
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className={`px-6 py-4 border-t flex items-center justify-end gap-3 ${
              isLight ? 'border-gray-100 bg-gray-50/50' : 'border-white/10 bg-white/[0.02]'
            }`}>
              <button
                onClick={onClose}
                disabled={isSubmitting}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isLight
                    ? 'text-gray-600 hover:bg-gray-100 border border-gray-200'
                    : 'text-white/60 hover:bg-white/10 border border-white/10'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!isFormValid || isSubmitting}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                  !isFormValid || isSubmitting
                    ? isLight
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-white/10 text-white/30 cursor-not-allowed'
                    : isLight
                      ? 'bg-[#247B7B] text-white hover:bg-[#1d6868] shadow-md hover:shadow-lg'
                      : 'bg-primary-600 text-white hover:bg-primary-500 shadow-lg shadow-primary-600/30'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Processing…
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={14} />
                    Submit Re-triage
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default ReTriageModal;
