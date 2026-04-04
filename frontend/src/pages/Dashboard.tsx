import { useEffect, useState } from 'react';
import PatientTriageForm from '../components/PatientTriageForm';
import TriageBoard from '../components/TriageBoard';
import StatsCard from '../components/StatsCard';
import { fetchPatients } from '../services/api';
import { Patient } from '../types';
import { FaAmbulance, FaClock, FaCheckCircle, FaChartLine } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const loadPatients = async () => {
    try {
      const data = await fetchPatients();
      setPatients(data || []);
      setError(null);
      setLastUpdate(new Date());
    } catch (err: any) {
      console.error('Failed to load patients:', err);
      setError(err.message || 'Unable to connect to the medical data service.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
    const interval = setInterval(loadPatients, 4000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { icon: FaAmbulance, label: 'Active Patients', value: patients.length, color: 'from-blue-500 to-cyan-500' },
    { icon: FaClock, label: 'Avg Wait Time', value: '4.2 min', color: 'from-yellow-500 to-orange-500' },
    { icon: FaCheckCircle, label: 'Triage Completed', value: '87%', color: 'from-green-500 to-emerald-500' },
    { icon: FaChartLine, label: 'Critical Cases', value: patients.filter(p => p.triageLevel === 'CRITICAL').length, color: 'from-red-500 to-pink-500' },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-4xl font-bold gradient-text mb-2">Welcome to VITALPASS</h1>
        <p className="text-white/60">
          An AI-driven Clinical Command Center that uses voice intelligence to automate ER triage,
          slash documentation time, and prioritize life-saving care in real-time.
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <StatsCard key={idx} {...stat} delay={idx * 0.1} />
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <PatientTriageForm onPatientAdded={loadPatients} />
        </div>
        <div className="lg:col-span-2">
          {error ? (
            <div className="glass-card p-12 text-center border-red-500/20">
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaChartLine className="text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Sync Error</h3>
              <p className="text-white/60 mb-6">{error}</p>
              <button 
                onClick={loadPatients}
                className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all"
              >
                Retry Connection
              </button>
            </div>
          ) : loading ? (
            <div className="glass-card p-12 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-white/60">Loading triage dashboard...</p>
            </div>
          ) : (
            <TriageBoard patients={patients} onPatientUpdate={loadPatients} />
          )}
        </div>
      </div>
      
      <div className="text-center text-xs text-white/30 pt-4">
        Last updated: {lastUpdate.toLocaleTimeString()} · Live data feed active
      </div>
    </div>
  );
};

export default Dashboard;