import { Patient, TriageLevel } from '../types';
import PatientCard from './PatientCard';
import { motion } from 'framer-motion';
import { FaSkullCrossbones, FaExclamationTriangle, FaShieldAlt } from 'react-icons/fa';
import { useTheme } from '../hooks/contexts/ThemeContext';

interface TriageBoardProps {
  patients: Patient[];
  onPatientUpdate: () => void;
}

const TriageBoard: React.FC<TriageBoardProps> = ({ patients, onPatientUpdate }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const criticalPatients = patients.filter(p => p.priority === 'RED' || p.priority === 'ORANGE' || p.triageLevel === TriageLevel.CRITICAL);
  const urgentPatients = patients.filter(p => p.priority === 'YELLOW' || p.triageLevel === TriageLevel.URGENT);
  const standardPatients = patients.filter(p => p.priority === 'GREEN' || p.priority === 'BLUE' || p.triageLevel === TriageLevel.STANDARD);

  const columns = [
    {
      title: 'CRITICAL',
      icon: FaSkullCrossbones,
      color: 'critical',
      bgGradient: 'from-red-600/20 to-red-900/20',
      lightBg: 'bg-red-100/70',
      borderColor: 'border-red-500/30',
      lightBorder: 'border-red-300',
      iconColor: isLight ? 'text-red-600' : 'text-red-400',
      patients: criticalPatients,
    },
    {
      title: 'URGENT',
      icon: FaExclamationTriangle,
      color: 'urgent',
      bgGradient: 'from-amber-600/20 to-amber-900/20',
      lightBg: 'bg-amber-100/70',
      borderColor: 'border-amber-500/30',
      lightBorder: 'border-amber-300',
      iconColor: isLight ? 'text-amber-600' : 'text-amber-400',
      patients: urgentPatients,
    },
    {
      title: 'STANDARD',
      icon: FaShieldAlt,
      color: 'standard',
      bgGradient: 'from-emerald-600/20 to-emerald-900/20',
      lightBg: 'bg-emerald-100/70',
      borderColor: 'border-emerald-500/30',
      lightBorder: 'border-emerald-300',
      iconColor: isLight ? 'text-emerald-600' : 'text-emerald-400',
      patients: standardPatients,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className={`text-2xl font-bold ${isLight ? 'text-[#1a2e2e]' : 'gradient-text'}`}>Live Triage Dashboard</h2>
        <div className={`flex items-center gap-2 text-xs ${isLight ? 'text-[#94a3a3]' : 'text-white/40'}`}>
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
            className={`glass-card overflow-hidden ${isLight ? `border-t-4 ${column.lightBorder}` : `border-t-4 border-${column.color}-500`}`}
          >
            <div className={`p-4 border-b ${
              isLight
                ? `${column.lightBg} ${column.lightBorder}`
                : `bg-gradient-to-r ${column.bgGradient} ${column.borderColor}`
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <column.icon className={`text-xl ${column.iconColor}`} />
                  <h3 className="font-bold text-lg theme-text">{column.title}</h3>
                </div>
                <span className={`status-badge status-${column.color}`}>
                  {column.patients.length} patients
                </span>
              </div>
              <p className={`text-xs mt-1 ${isLight ? 'text-[#94a3a3]' : 'text-white/40'}`}>
                {column.title === 'CRITICAL' && 'Immediate action required'}
                {column.title === 'URGENT' && 'Monitor closely'}
                {column.title === 'STANDARD' && 'Safe to wait'}
              </p>
            </div>
            
            <div className="p-3 max-h-[600px] overflow-y-auto space-y-3">
              {column.patients.length === 0 ? (
                <div className={`text-center py-8 text-sm ${isLight ? 'text-[#b0bfbf]' : 'text-white/30'}`}>
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