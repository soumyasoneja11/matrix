import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaUsers, FaCalendarCheck, FaHeartbeat } from 'react-icons/fa';
import { useTheme } from '../hooks/contexts/ThemeContext';
import PatientHistoryCard from '../components/PatientHistory/PatientHistoryCard';
import { historyAPI, PatientHistoryRecordApi } from '../services/api';
import { PatientHistoryRecord, TriageLevel } from '../types';
import { useAuth } from '../hooks/contexts/AuthContext';

const PatientHistory = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [records, setRecords] = useState<PatientHistoryRecordApi[]>([]);
  const mapRecord = (record: PatientHistoryRecordApi): PatientHistoryRecord => ({
    ...record,
    visits: (record.visits || []).map((visit) => ({
      ...visit,
      triageLevel:
        visit.triageLevel === 'CRITICAL'
          ? TriageLevel.CRITICAL
          : visit.triageLevel === 'URGENT'
            ? TriageLevel.URGENT
            : TriageLevel.STANDARD,
    })),
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setLoading(true);
        if (user?.role === 'PATIENT') {
          const mine = await historyAPI.getMine();
          setRecords(mine ? [mine] : []);
        } else {
          const data = await historyAPI.getAll();
          setRecords(data.data || []);
        }
      } finally {
        setLoading(false);
      }
    };
    loadHistory();
  }, [user?.role]);

  // Filter patients by search
  const filteredPatients = useMemo(() => {
    if (!searchQuery.trim()) return records;
    const q = searchQuery.toLowerCase();
    return records.filter(
      p =>
        (p.name || '').toLowerCase().includes(q) ||
        (p.id || '').toLowerCase().includes(q) ||
        (p.visits || []).some(v => (v.complaint || '').toLowerCase().includes(q))
    );
  }, [searchQuery, records]);

  // Summary stats
  const totalPatients = records.length;
  const totalVisits = records.reduce((sum, p) => sum + p.visits.length, 0);
  const activeCases = records.filter(p => p.visits.some(v => v.status === 'ongoing')).length;

  // List view
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between gap-4">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className={`text-3xl font-bold ${isLight ? 'text-[#1a2e2e]' : 'gradient-text'}`}>
            {user?.role === 'PATIENT' ? 'My medical history' : 'Patient History'}
          </h1>
          <p className="theme-text-muted mt-2">
            {user?.role === 'PATIENT'
              ? 'Your visits and care timeline'
              : 'Structured medical records & visit timelines'}
          </p>
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
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="glass-card p-12 text-center"
          >
            <div className="w-8 h-8 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto" />
          </motion.div>
        ) : filteredPatients.length === 0 ? (
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
                patient={mapRecord(patient)}
                index={idx}
                onClick={() => navigate(`/patient/${patient.id}`)}
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
