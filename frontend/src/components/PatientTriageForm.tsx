import { useState } from 'react';
import VoiceCaptureButton from './VoiceCaptureButton';
import { createPatient } from '../services/api';
import { motion } from 'framer-motion';
import { FaLanguage, FaMagic, FaClock, FaChartLine, FaMicrophone } from 'react-icons/fa';

interface PatientTriageFormProps {
  onPatientAdded: () => void;
}

const PatientTriageForm: React.FC<PatientTriageFormProps> = ({ onPatientAdded }) => {
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('en-US');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVoiceTranscript = (transcript: string) => {
    setDescription(prev => prev + (prev ? ' ' : '') + transcript);
  };

  const handleSubmit = async () => {
    if (!description.trim()) return;
    
    setIsSubmitting(true);
    try {
      await createPatient({ description });
      setDescription('');
      onPatientAdded();
    } catch (error) {
      console.error('Failed to create patient:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <h2 className="text-2xl font-bold mb-2 gradient-text">Patient Triage</h2>
      <p className="text-white/60 text-sm mb-6">Voice-powered intake & AI-driven urgency classification</p>
      
      <div className="space-y-4">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium mb-2">
            <FaLanguage />
            Voice Language
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary-500"
          >
            <option value="en-US">English (US)</option>
            <option value="en-GB">English (UK)</option>
            <option value="es-ES">Spanish</option>
            <option value="fr-FR">French</option>
            <option value="hi-IN">Hindi</option>
          </select>
        </div>
        
        <div className="bg-primary-500/10 border border-primary-500/20 rounded-xl p-3">
          <p className="text-xs text-primary-300 flex items-center gap-2">
            <FaMagic className="text-primary-400" />
            AI Tip: Include age, symptoms, pain level, and duration for accurate triage
          </p>
        </div>
        
        <div>
          <label className="text-sm font-medium mb-2 block">Patient Information</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe patient condition: age, symptoms, vitals, history..."
            rows={4}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-primary-500 transition-all resize-none"
          />
        </div>
        
        <VoiceCaptureButton onTranscript={handleVoiceTranscript} language={language} />
        
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !description.trim()}
          className="btn-primary w-full"
        >
          {isSubmitting ? 'Processing...' : 'Start Triage →'}
        </button>
      </div>
      
      <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-white/10">
        <div className="text-center">
          <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
            <FaMicrophone className="text-blue-400" />
          </div>
          <p className="text-xs font-medium">Voice Capture</p>
          <p className="text-[10px] text-white/40">Hands-free, multilingual</p>
        </div>
        <div className="text-center">
          <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
            <FaMagic className="text-purple-400" />
          </div>
          <p className="text-xs font-medium">AI Extraction</p>
          <p className="text-[10px] text-white/40">Symptoms, vitals parsing</p>
        </div>
        <div className="text-center">
          <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center">
            <FaChartLine className="text-red-400" />
          </div>
          <p className="text-xs font-medium">Urgency Scoring</p>
          <p className="text-[10px] text-white/40">Critical/Urgent/Standard</p>
        </div>
      </div>
    </motion.div>
  );
};

export default PatientTriageForm;