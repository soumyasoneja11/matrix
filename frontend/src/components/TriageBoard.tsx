import { Patient, TriageLevel } from '../types';
import PatientCard from './PatientCard';
import { motion } from 'framer-motion';
import { FaSkullCrossbones, FaExclamationTriangle, FaShieldAlt } from 'react-icons/fa';

interface TriageBoardProps {
  patients: Patient[];
  onPatientUpdate: () => void;
}

const TriageBoard: React.FC<TriageBoardProps> = ({ patients, onPatientUpdate }) => {
  const criticalPatients = patients.filter(p => p.triageLevel === TriageLevel.CRITICAL);
  const urgentPatients = patients.filter(p => p.triageLevel === TriageLevel.URGENT);
  const standardPatients = patients.filter(p => p.triageLevel === TriageLevel.STANDARD);

  const columns = [
    {
      title: 'CRITICAL',
      icon: FaSkullCrossbones,
      color: 'critical',
      bgGradient: 'from-red-600/20 to-red-900/20',
      borderColor: 'border-red-500/30',
      patients: criticalPatients,
    },
    {
      title: 'URGENT',
      icon: FaExclamationTriangle,
      color: 'urgent',
      bgGradient: 'from-amber-600/20 to-amber-900/20',
      borderColor: 'border-amber-500/30',
      patients: urgentPatients,
    },
    {
      title: 'STANDARD',
      icon: FaShieldAlt,
      color: 'standard',
      bgGradient: 'from-emerald-600/20 to-emerald-900/20',
      borderColor: 'border-emerald-500/30',
      patients: standardPatients,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold gradient-text">Live Triage Dashboard</h2>
        <div className="flex items-center gap-2 text-xs text-white/40">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          Auto-refreshes every 4s
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {columns.map((column, idx) => (
          <motion.div
            key={column.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`glass-card overflow-hidden border-t-4 border-${column.color}-500`}
          >
            <div className={`p-4 bg-gradient-to-r ${column.bgGradient} border-b ${column.borderColor}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <column.icon className={`text-${column.color}-400 text-xl`} />
                  <h3 className="font-bold text-lg">{column.title}</h3>
                </div>
                <span className={`status-badge status-${column.color}`}>
                  {column.patients.length} patients
                </span>
              </div>
              <p className="text-xs text-white/40 mt-1">
                {column.title === 'CRITICAL' && 'Immediate action required'}
                {column.title === 'URGENT' && 'Monitor closely'}
                {column.title === 'STANDARD' && 'Safe to wait'}
              </p>
            </div>
            
            <div className="p-3 max-h-[600px] overflow-y-auto space-y-3">
              {column.patients.length === 0 ? (
                <div className="text-center py-8 text-white/30 text-sm">
                  No patients in this category
                </div>
              ) : (
                column.patients.map((patient) => (
                  <PatientCard key={patient.id} patient={patient} onUpdate={onPatientUpdate} />
                ))
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TriageBoard;