import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaUsers, FaCalendarCheck, FaHeartbeat } from 'react-icons/fa';
import { ArrowLeft } from 'lucide-react';
import { useTheme } from '../hooks/contexts/ThemeContext';
import PatientHistoryCard from '../components/PatientHistory/PatientHistoryCard';
import PatientHistoryHeader from '../components/PatientHistory/PatientHistoryHeader';
import PatientTimeline from '../components/PatientHistory/PatientTimeline';
import { PATIENT_HISTORY_DATA } from '../data/patientHistoryData';
import { PatientHistoryRecord } from '../types';

const PatientHistory = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<PatientHistoryRecord | null>(null);

  // Filter patients by search
  const filteredPatients = useMemo(() => {
    if (!searchQuery.trim()) return PATIENT_HISTORY_DATA;
    const q = searchQuery.toLowerCase();
    return PATIENT_HISTORY_DATA.filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.visits.some(v => v.complaint.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  // Summary stats
  const totalPatients = PATIENT_HISTORY_DATA.length;
  const totalVisits = PATIENT_HISTORY_DATA.reduce((sum, p) => sum + p.visits.length, 0);
  const activeCases = PATIENT_HISTORY_DATA.filter(p => p.visits.some(v => v.status === 'ongoing')).length;

  // Detail view
  if (selectedPatient) {
    return (
      <div className="space-y-6">
        <PatientHistoryHeader
          patient={selectedPatient}
          onClose={() => setSelectedPatient(null)}
        />
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
                ({selectedPatient.visits.length} records)
              </span>
            </h3>
          </motion.div>
          <PatientTimeline visits={selectedPatient.visits} />
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between gap-4">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className={`text-3xl font-bold ${isLight ? 'text-[#1a2e2e]' : 'gradient-text'}`}>
            Patient History
          </h1>
          <p className="theme-text-muted mt-2">Structured medical records &amp; visit timelines</p>
        </motion.div>
      </div>

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-4"
      >
        <StatCard
          icon={FaUsers}
          label="Total Patients"
          value={totalPatients}
          gradient="from-blue-500 to-cyan-500"
          isLight={isLight}
        />
        <StatCard
          icon={FaCalendarCheck}
          label="Total Visits"
          value={totalVisits}
          gradient="from-emerald-500 to-green-500"
          isLight={isLight}
        />
        <StatCard
          icon={FaHeartbeat}
          label="Active Cases"
          value={activeCases}
          gradient="from-red-500 to-pink-500"
          isLight={isLight}
        />
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className={`glass-card px-4 py-3 flex items-center gap-3 ${isLight ? '' : 'border-white/10'}`}
      >
        <FaSearch className={isLight ? 'text-gray-400' : 'text-white/40'} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by patient name, ID, or complaint..."
          className={`flex-1 bg-transparent outline-none text-sm ${isLight ? 'text-gray-800 placeholder:text-gray-400' : 'text-white placeholder:text-white/30'}`}
          id="patient-history-search"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className={`text-xs px-2 py-1 rounded-lg transition-colors ${isLight ? 'text-gray-400 hover:bg-gray-100' : 'text-white/40 hover:bg-white/10'}`}
          >
            Clear
          </button>
        )}
      </motion.div>

      {/* Patient Grid */}
      <AnimatePresence mode="wait">
        {filteredPatients.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="glass-card p-12 text-center"
          >
            <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${isLight ? 'bg-gray-100' : 'bg-white/5'}`}>
              <FaSearch className={`text-2xl ${isLight ? 'text-gray-300' : 'text-white/20'}`} />
            </div>
            <h3 className={`text-lg font-bold mb-1 ${isLight ? 'text-gray-700' : 'text-white/80'}`}>
              No patients found
            </h3>
            <p className={`text-sm ${isLight ? 'text-gray-400' : 'text-white/40'}`}>
              {searchQuery
                ? `No results for "${searchQuery}". Try a different search term.`
                : 'No patient history records available.'}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {filteredPatients.map((patient, idx) => (
              <PatientHistoryCard
                key={patient.id}
                patient={patient}
                index={idx}
                onClick={() => setSelectedPatient(patient)}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ── Sub-component ── */
function StatCard({ icon: Icon, label, value, gradient, isLight }: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  gradient: string;
  isLight: boolean;
}) {
  return (
    <div className={`glass-card p-4 flex items-center gap-4 ${isLight ? '' : 'border-white/10'}`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isLight ? 'bg-[#247B7B]' : `bg-gradient-to-r ${gradient}`}`}>
        <Icon className="text-white text-lg" />
      </div>
      <div>
        <p className={`text-xs font-medium ${isLight ? 'text-gray-400' : 'text-white/40'}`}>{label}</p>
        <p className={`text-xl font-bold tabular-nums ${isLight ? 'text-[#1a2e2e]' : 'text-white'}`}>{value}</p>
      </div>
    </div>
  );
}

export default PatientHistory;
