import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrashAlt, FaUndo, FaUserMd, FaClock, FaExclamationTriangle } from 'react-icons/fa';
import { Trash2 } from 'lucide-react';
import { useTheme } from '../hooks/contexts/ThemeContext';
import { useRecycleBin, DischargedPatient } from '../hooks/contexts/RecycleBinContext';
import { useNotifications } from '../hooks/contexts/NotificationContext';
import { patientAPI } from '../services/api';
import { TriageLevel } from '../types';

const RecycleBin = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const { dischargedPatients, restorePatient, permanentDelete } = useRecycleBin();
  const { addNotification } = useNotifications();

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const getDaysRemaining = (dischargedAt: string, retentionDays: number) => {
    const discharged = new Date(dischargedAt);
    const expiresAt = new Date(discharged.getTime() + retentionDays * 24 * 60 * 60 * 1000);
    const now = new Date();
    const diff = expiresAt.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diff / (24 * 60 * 60 * 1000)));
  };

  const getTriageBadge = (level: string) => {
    switch (level) {
      case TriageLevel.CRITICAL:
        return { bg: isLight ? 'bg-red-50' : 'bg-red-500/10', text: isLight ? 'text-red-600' : 'text-red-400', border: isLight ? 'border-red-200' : 'border-red-500/30' };
      case TriageLevel.URGENT:
        return { bg: isLight ? 'bg-amber-50' : 'bg-amber-500/10', text: isLight ? 'text-amber-600' : 'text-amber-400', border: isLight ? 'border-amber-200' : 'border-amber-500/30' };
      default:
        return { bg: isLight ? 'bg-emerald-50' : 'bg-emerald-500/10', text: isLight ? 'text-emerald-600' : 'text-emerald-400', border: isLight ? 'border-emerald-200' : 'border-emerald-500/30' };
    }
  };

  const handleRestore = async (dp: DischargedPatient) => {
    if (processingId) return;
    setProcessingId(dp.patient.id);

    const restored = restorePatient(dp.patient.id);

    if (restored) {
      try {
        await patientAPI.restore(restored.id);
      } catch {
        // Local restore still applies
      }
      addNotification(`Patient ${restored.name || 'Unknown'} restored to active board`, 'success');
    }

    setProcessingId(null);
  };

  const handlePermanentDelete = async (dp: DischargedPatient) => {
    if (processingId) return;
    setProcessingId(dp.patient.id);

    permanentDelete(dp.patient.id);

    try {
      await patientAPI.permanentDelete(dp.patient.id);
    } catch {
      // Local delete still applies
    }

    addNotification(`Patient ${dp.patient.name || 'Unknown'} permanently deleted`, 'error');
    setConfirmDeleteId(null);
    setProcessingId(null);
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className={`text-3xl font-bold ${isLight ? 'text-[#1a2e2e]' : 'gradient-text'}`}>Recycle Bin</h1>
        <p className="theme-text-muted mt-2">
          Restore or permanently delete discharged patients
          {dischargedPatients.length > 0 && (
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
              isLight ? 'bg-gray-100 text-gray-600' : 'bg-white/10 text-white/50'
            }`}>
              {dischargedPatients.length} patient{dischargedPatients.length !== 1 ? 's' : ''}
            </span>
          )}
        </p>
      </motion.div>

      {dischargedPatients.length === 0 ? (
        <div className="glass-card p-6">
          <div className="text-center py-12">
            <FaTrashAlt className={`text-5xl mx-auto mb-4 ${isLight ? 'text-[#d4cec5]' : 'text-white/20'}`} />
            <p className="theme-text-subtle">No items in recycle bin</p>
            <p className="text-sm theme-text-faint mt-2">Discharged patients appear here for 10 days</p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {dischargedPatients.map((dp, i) => {
              const daysLeft = getDaysRemaining(dp.dischargedAt, dp.retentionDays);
              const badge = getTriageBadge(dp.patient.triageLevel);
              const isExpiring = daysLeft <= 2;

              return (
                <motion.div
                  key={dp.patient.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: i * 0.05 }}
                  className={`glass-card p-5 flex items-center justify-between gap-4 ${
                    isLight ? 'hover:shadow-md' : 'hover:bg-white/[0.06]'
                  } transition-all`}
                >
                  {/* Left: Patient info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className={`font-bold text-base ${isLight ? 'text-gray-900' : 'text-white'}`}>
                        {dp.patient.name || 'Unnamed Patient'}
                      </h3>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono ${
                        isLight ? 'bg-gray-100 text-gray-500' : 'bg-white/8 text-white/40'
                      }`}>
                        #{dp.patient.id}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${badge.bg} ${badge.text} ${badge.border}`}>
                        {dp.patient.triageLevel}
                      </span>
                    </div>

                    <div className={`flex items-center gap-4 text-xs ${isLight ? 'text-gray-500' : 'text-white/50'}`}>
                      <span className="flex items-center gap-1">
                        <FaUserMd size={10} />
                        {dp.dischargedBy}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaClock size={10} />
                        {new Date(dp.dischargedAt).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric',
                          hour: '2-digit', minute: '2-digit'
                        })}
                      </span>
                    </div>

                    {dp.patient.description && (
                      <p className={`text-xs mt-1.5 truncate max-w-md ${isLight ? 'text-gray-400' : 'text-white/30'}`}>
                        {dp.patient.description}
                      </p>
                    )}
                  </div>

                  {/* Right: Retention badge + actions */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {/* Retention badge */}
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 ${
                      isExpiring
                        ? (isLight ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-red-500/10 text-red-400 border border-red-500/30')
                        : (isLight ? 'bg-gray-50 text-gray-500 border border-gray-200' : 'bg-white/5 text-white/40 border border-white/10')
                    }`}>
                      {isExpiring && <FaExclamationTriangle size={10} />}
                      {daysLeft}d left
                    </span>

                    {/* Restore */}
                    <button
                      onClick={() => handleRestore(dp)}
                      disabled={processingId === dp.patient.id}
                      className={`p-2 rounded-xl transition-colors ${
                        isLight
                          ? 'text-emerald-600 hover:bg-emerald-50 border border-gray-200 hover:border-emerald-200'
                          : 'text-emerald-400 hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-500/30'
                      } disabled:opacity-50`}
                      title="Restore patient"
                    >
                      <FaUndo size={13} />
                    </button>

                    {/* Delete */}
                    {confirmDeleteId === dp.patient.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handlePermanentDelete(dp)}
                          disabled={processingId === dp.patient.id}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                            isLight ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-red-600 text-white hover:bg-red-500'
                          } disabled:opacity-50`}
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                            isLight ? 'bg-gray-100 text-gray-600' : 'bg-white/5 text-white/60'
                          }`}
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDeleteId(dp.patient.id)}
                        disabled={processingId === dp.patient.id}
                        className={`p-2 rounded-xl transition-colors ${
                          isLight
                            ? 'text-red-500 hover:bg-red-50 border border-gray-200 hover:border-red-200'
                            : 'text-red-400 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30'
                        } disabled:opacity-50`}
                        title="Permanently delete"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default RecycleBin;