import { useState } from 'react';
import VoiceCaptureButton from './VoiceCaptureButton';
import { createPatient } from '../services/api';
import { motion } from 'framer-motion';
import { FaLanguage, FaMagic, FaClock, FaChartLine, FaMicrophone } from 'react-icons/fa';
import { useTheme } from '../hooks/contexts/ThemeContext';

interface PatientTriageFormProps {
  onPatientAdded: () => void;
}

const PatientTriageForm: React.FC<PatientTriageFormProps> = ({ onPatientAdded }) => {
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('en-US');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const handleVoiceTranscript = (transcript: string) => {
    setDescription(prev => prev + (prev ? ' ' : '') + transcript);
  };

  const handleSubmit = async () => {
    if (!description.trim()) return;
    
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);
    try {
      await createPatient({ description });
      setDescription('');
      setSuccess(true);
      onPatientAdded();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to create patient record. Please try again.');
      console.error('Failed to create patient:', err);
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
      <h2 className={`text-2xl font-bold mb-2 ${isLight ? 'text-[#1a2e2e]' : 'gradient-text'}`}>Patient Triage</h2>
      <p className="theme-text-muted text-sm mb-6">Voice-powered intake & AI-driven urgency classification</p>
      
      <div className="space-y-4">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium mb-2 theme-text">
            <FaLanguage />
            Voice Language
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:border-primary-500 transition-all ${
              isLight
                ? 'bg-[#f8f6f1] border-[#e0dbd2] text-[#1a2e2e]'
                : 'bg-white/5 border-white/10 text-white'
            }`}
          >
            <option value="en-US">English (US)</option>
            <option value="en-GB">English (UK)</option>
            <option value="es-ES">Spanish</option>
            <option value="fr-FR">French</option>
            <option value="hi-IN">Hindi</option>
          </select>
        </div>
        
        <div className={`rounded-xl p-3 ${isLight ? 'bg-[#e8f5f5] border border-[#247B7B]/20' : 'bg-primary-500/10 border border-primary-500/20'}`}>
          <p className={`text-xs flex items-center gap-2 ${isLight ? 'text-[#247B7B]' : 'text-primary-300'}`}>
            <FaMagic className={isLight ? 'text-[#247B7B]' : 'text-primary-400'} />
            AI Tip: Include age, symptoms, pain level, and duration for accurate triage
          </p>
        </div>
        
        <div>
          <label className="text-sm font-medium mb-2 block theme-text">Patient Information</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe patient condition: age, symptoms, vitals, history..."
            rows={4}
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-primary-500 transition-all resize-none ${
              isLight
                ? 'bg-[#f8f6f1] border-[#e0dbd2] text-[#1a2e2e] placeholder-[#b0bfbf]'
                : 'bg-white/5 border-white/10 text-white placeholder-white/30'
            }`}
          />
        </div>
        
        <VoiceCaptureButton onTranscript={handleVoiceTranscript} language={language} />
        
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-xs">
            Patient triaged successfully!
          </div>
        )}
        
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !description.trim()}
          className="btn-primary w-full"
        >
          {isSubmitting ? 'Processing...' : 'Start Triage →'}
        </button>
      </div>
      
      <div className={`grid grid-cols-3 gap-3 mt-6 pt-6 border-t ${isLight ? 'border-[#e8e2d9]' : 'border-white/10'}`}>
        <div className="text-center">
          <div className={`w-10 h-10 mx-auto mb-2 rounded-lg flex items-center justify-center ${
            isLight ? 'bg-blue-50' : 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20'
          }`}>
            <FaMicrophone className={isLight ? 'text-blue-500' : 'text-blue-400'} />
          </div>
          <p className="text-xs font-medium theme-text">Voice Capture</p>
          <p className={`text-[10px] ${isLight ? 'text-[#94a3a3]' : 'text-white/40'}`}>Hands-free, multilingual</p>
        </div>
        <div className="text-center">
          <div className={`w-10 h-10 mx-auto mb-2 rounded-lg flex items-center justify-center ${
            isLight ? 'bg-purple-50' : 'bg-gradient-to-br from-purple-500/20 to-pink-500/20'
          }`}>
            <FaMagic className={isLight ? 'text-purple-500' : 'text-purple-400'} />
          </div>
          <p className="text-xs font-medium theme-text">AI Extraction</p>
          <p className={`text-[10px] ${isLight ? 'text-[#94a3a3]' : 'text-white/40'}`}>Symptoms, vitals parsing</p>
        </div>
        <div className="text-center">
          <div className={`w-10 h-10 mx-auto mb-2 rounded-lg flex items-center justify-center ${
            isLight ? 'bg-red-50' : 'bg-gradient-to-br from-red-500/20 to-orange-500/20'
          }`}>
            <FaChartLine className={isLight ? 'text-red-500' : 'text-red-400'} />
          </div>
          <p className="text-xs font-medium theme-text">Urgency Scoring</p>
          <p className={`text-[10px] ${isLight ? 'text-[#94a3a3]' : 'text-white/40'}`}>Critical/Urgent/Standard</p>
        </div>
      </div>
    </motion.div>
  );
};

export default PatientTriageForm;