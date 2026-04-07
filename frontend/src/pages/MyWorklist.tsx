import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaClipboardCheck, FaHourglassHalf, FaCheckCircle } from 'react-icons/fa';
import { useTheme } from '../hooks/contexts/ThemeContext';
import { Patient } from '../types';
import { worklistAPI } from '../services/api';

const iconByStatus = {
  TRIAGED: FaHourglassHalf,
  IN_TREATMENT: FaClipboardCheck,
  OBSERVATION: FaClipboardCheck,
  DISCHARGED: FaCheckCircle,
};

const statusLabel = (status?: string) => {
  const value = (status || 'TRIAGED').replace(/_/g, ' ');
  return value.charAt(0) + value.slice(1).toLowerCase();
};

const nextStatus = (status?: string) => {
  switch (status) {
    case 'TRIAGED':
      return 'IN_TREATMENT';
    case 'IN_TREATMENT':
      return 'OBSERVATION';
    case 'OBSERVATION':
      return 'DISCHARGED';
    default:
      return 'IN_TREATMENT';
  }
};

const MyWorklist = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [worklist, setWorklist] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadWorklist = async () => {
    try {
      setLoading(true);
      const items = await worklistAPI.getMyWorklist();
      setWorklist(items);
      setError('');
    } catch (err: any) {
      setError(err?.message || 'Unable to load worklist from backend');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorklist();
  }, []);

  const handleUpdate = async (patient: Patient) => {
    try {
      setUpdatingId(patient.id);
      const updated = await worklistAPI.updateStatus(patient.id, nextStatus(patient.status));
      setWorklist((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    } catch (err: any) {
      setError(err?.message || 'Failed to update task status');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className={`text-3xl font-bold ${isLight ? 'text-[#1a2e2e]' : 'gradient-text'}`}>My Worklist</h1>
        <p className="theme-text-muted mt-2">Your assigned tasks and priorities</p>
      </motion.div>

      {error && (
        <div className={`glass-card p-3 text-sm ${isLight ? 'bg-red-50 text-red-700 border-red-200' : 'bg-red-500/10 text-red-300 border-red-500/30'}`}>
          {error}
        </div>
      )}

      <div className="glass-card p-6">
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          </div>
        ) : worklist.length === 0 ? (
          <div className="text-center py-10 theme-text-muted">No assigned patients found in worklist.</div>
        ) : (
          <div className="space-y-3">
            {worklist.map((patient, idx) => {
              const taskStatus = patient.status || 'TRIAGED';
              const priority =
                patient.triageLevel === 'CRITICAL'
                  ? 'high'
                  : patient.triageLevel === 'URGENT'
                    ? 'medium'
                    : 'low';
              const Icon = iconByStatus[taskStatus as keyof typeof iconByStatus] || FaHourglassHalf;
              const taskTitle = patient.roomCode
                ? `Review triage for Room ${patient.roomCode}`
                : `Review patient ${patient.name || 'Unknown'}`;

              return (
                <motion.div
                  key={patient.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                    isLight ? 'bg-[#f8f6f1] hover:bg-[#f0ece4]' : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    priority === 'high'
                      ? (isLight ? 'bg-red-50 text-red-500' : 'bg-red-500/20 text-red-400')
                      : priority === 'medium'
                        ? (isLight ? 'bg-yellow-50 text-yellow-600' : 'bg-yellow-500/20 text-yellow-400')
                        : (isLight ? 'bg-green-50 text-green-500' : 'bg-green-500/20 text-green-400')
                  }`}>
                    <Icon />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium theme-text">{taskTitle}</p>
                    <p className="text-xs theme-text-muted capitalize">{statusLabel(taskStatus)}</p>
                  </div>
                  <button
                    onClick={() => handleUpdate(patient)}
                    disabled={updatingId === patient.id || taskStatus === 'DISCHARGED'}
                    className={`px-4 py-1.5 rounded-lg text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed ${
                      isLight
                        ? 'bg-[#e8f5f5] text-[#247B7B] hover:bg-[#247B7B] hover:text-white'
                        : 'bg-primary-600/50 hover:bg-primary-600 text-white'
                    }`}
                  >
                    {updatingId === patient.id ? 'Saving...' : 'Update'}
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyWorklist;
