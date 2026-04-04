import { useState, useEffect } from 'react';
import { FaMicrophone, FaStop, FaSpinner } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

interface VoiceCaptureButtonProps {
  onTranscript: (text: string) => void;
  language?: string;
}

const VoiceCaptureButton: React.FC<VoiceCaptureButtonProps> = ({ onTranscript, language = 'en-US' }) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = language;
      
      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setIsProcessing(true);
        onTranscript(transcript);
        setTimeout(() => {
          setIsProcessing(false);
          setIsListening(false);
        }, 500);
      };
      
      recognitionInstance.onerror = () => {
        setIsListening(false);
        setIsProcessing(false);
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
    }
    
    return () => {
      if (recognition) {
        recognition.abort();
      }
    };
  }, [language]);

  const toggleListening = () => {
    if (isListening) {
      recognition?.abort();
      setIsListening(false);
    } else {
      try {
        recognition?.start();
        setIsListening(true);
      } catch (error) {
        console.error('Speech recognition error:', error);
      }
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleListening}
      disabled={isProcessing}
      className={`
        relative w-full py-4 rounded-xl font-semibold transition-all duration-300
        ${isListening 
          ? 'bg-gradient-to-r from-red-600 to-red-700 shadow-red-500/50 shadow-lg' 
          : 'bg-gradient-to-r from-primary-600 to-purple-600 hover:shadow-primary-500/50 hover:shadow-lg'
        }
        ${isProcessing && 'opacity-50 cursor-not-allowed'}
      `}
    >
      <AnimatePresence mode="wait">
        {isProcessing ? (
          <motion.div
            key="processing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center gap-2"
          >
            <FaSpinner className="animate-spin" />
            <span>Processing...</span>
          </motion.div>
        ) : isListening ? (
          <motion.div
            key="listening"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center gap-2"
          >
            <FaMicrophone className="animate-pulse" />
            <span>Listening... Click to stop</span>
          </motion.div>
        ) : (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center gap-2"
          >
            <FaMicrophone />
            <span>Tap to record</span>
            <span className="text-xs opacity-70">Multilingual voice intake</span>
          </motion.div>
        )}
      </AnimatePresence>
      
      {isListening && (
        <div className="absolute inset-0 rounded-xl voice-pulse" />
      )}
    </motion.button>
  );
};

export default VoiceCaptureButton;