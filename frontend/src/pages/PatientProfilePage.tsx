import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaCalendarCheck, FaExclamationTriangle } from 'react-icons/fa';
import { ArrowLeft, UserX } from 'lucide-react';
import { useTheme } from '../hooks/contexts/ThemeContext';
import PatientHistoryHeader from '../components/PatientHistory/PatientHistoryHeader';
import PatientTimeline from '../components/PatientHistory/PatientTimeline';
import { historyAPI, PatientHistoryRecordApi } from '../services/api';
import { PatientHistoryRecord, TriageLevel } from '../types';

const PatientProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [patient, setPatient] = useState<PatientHistoryRecordApi | null>(null);
  const mappedPatient: PatientHistoryRecord | null = patient
    ? {
        ...patient,
        visits: (patient.visits || []).map((visit) => ({
          ...visit,
          triageLevel:
            visit.triageLevel === 'CRITICAL'
              ? TriageLevel.CRITICAL
              : visit.triageLevel === 'URGENT'
                ? TriageLevel.URGENT
                : TriageLevel.STANDARD,
        })),
      }
    : null;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await historyAPI.getById(id);
        setPatient(data.data || null);
      } catch {
        setPatient(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-8 h-8 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  // ── 404: Patient Not Found ──
  if (!mappedPatient) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center ${
            isLight ? 'bg-red-50' : 'bg-red-500/10'
          }`}>
            <UserX size={36} className={isLight ? 'text-red-400' : 'text-red-400/80'} />
          </div>
          <h2 className={`text-2xl font-bold mb-2 ${isLight ? 'text-gray-900' : 'text-white'}`}>
            Patient Not Found
          </h2>
          <p className={`text-sm mb-6 ${isLight ? 'text-gray-500' : 'text-white/50'}`}>
            No patient record exists for ID <span className="font-mono font-semibold">#{id}</span>.
            The link may be broken or the patient may have been removed.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => navigate('/patient-history')}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isLight
                  ? 'bg-[#247B7B] text-white hover:bg-[#1e6868] shadow-sm'
                  : 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg'
              }`}
            >
              <ArrowLeft size={15} />
              Back to Patient History
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Patient Profile ──
  return (
    <div className="space-y-6">
      {/* Back navigation */}
      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
        <button
          onClick={() => navigate('/patient-history')}
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            isLight
              ? 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              : 'text-white/50 hover:text-white/80 hover:bg-white/10'
          }`}
        >
          <ArrowLeft size={15} />
          Back to Patient History
        </button>
      </motion.div>

      {/* Patient Header with QR */}
      <PatientHistoryHeader
        patient={mappedPatient}
        onClose={() => navigate('/patient-history')}
      />

      {/* Visit History Section */}
      <div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${isLight ? 'text-[#1a2e2e]' : 'text-white'}`}>
            <FaCalendarCheck size={16} className={isLight ? 'text-[#247B7B]' : 'text-primary-400'} />
            Visit History
            <span className={`text-xs font-normal ml-1 ${isLight ? 'text-gray-400' : 'text-white/40'}`}>
              ({mappedPatient.visits.length} records)
            </span>
          </h3>
        </motion.div>
        <PatientTimeline visits={mappedPatient.visits} />
      </div>
    </div>
  );
};

export default PatientProfilePage;
