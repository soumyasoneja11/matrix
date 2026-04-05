import { Patient, TriageLevel } from '../types';
import { motion } from 'framer-motion';
import { FaUserMd, FaClock, FaMapMarkerAlt, FaStethoscope } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';

interface PatientCardProps {
  patient: Patient;
  onUpdate: () => void;
}

const PatientCard: React.FC<PatientCardProps> = ({ patient, onUpdate }) => {
  const getTriageColor = () => {
    switch (patient.triageLevel) {
      case TriageLevel.CRITICAL: return 'from-red-600 to-red-700';
      case TriageLevel.URGENT: return 'from-amber-600 to-amber-700';
      case TriageLevel.STANDARD: return 'from-emerald-600 to-emerald-700';
      default: return 'from-gray-600 to-gray-700';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02, y: -2 }}
      className="glass-card p-4 cursor-pointer transition-all duration-300 hover:bg-white/10"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-bold text-lg">{patient.name || 'Unnamed Patient'}</h4>
          <p className="text-xs text-white/50">Age: {patient.age || 'N/A'}</p>
        </div>
        <div className={`px-2 py-1 rounded-lg text-xs font-bold bg-gradient-to-r ${getTriageColor()}`}>
          {patient.triageLevel}
        </div>
      </div>
      
      <p className="text-sm text-white/80 mb-3 line-clamp-2">
        {patient.description}
      </p>
      
      <div className="flex items-center gap-4 text-xs text-white/50">
        <div className="flex items-center gap-1">
          <FaUserMd className="text-primary-400" />
          <span>{patient.assignedStaff || 'Unassigned'}</span>
        </div>
        <div className="flex items-center gap-1">
          <FaMapMarkerAlt className="text-primary-400" />
          <span>{patient.location || 'Triage'}</span>
        </div>
        <div className="flex items-center gap-1">
          <FaClock className="text-primary-400" />
          <span>{formatDistanceToNow(new Date(patient.createdAt || Date.now()), { addSuffix: true })}</span>
        </div>
      </div>
      
      {patient.vitals && (
        <div className="mt-3 pt-3 border-t border-white/10 flex gap-3 text-xs">
          <span>❤️ {patient.vitals.heartRate || '--'} bpm</span>
          <span>🫀 BP: {patient.vitals.bloodPressure || '--'}</span>
          <span>🌡️ {patient.vitals.temperature || '--'}°C</span>
        </div>
      )}
    </motion.div>
  );
};

export default PatientCard;