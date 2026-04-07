import { useEffect, useRef, useState } from 'react';
import { FaMicrophone, FaSpinner } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../hooks/contexts/ThemeContext';

interface VoiceCaptureButtonProps {
  onTranscript: (text: string) => void;
  language?: string;
}

const VoiceCaptureButton: React.FC<VoiceCaptureButtonProps> = ({ onTranscript, language = 'en-US' }) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const shouldKeepListeningRef = useRef(false);
  const { theme } = useTheme();
  const isLight = theme === 'light';

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = language;

      recognitionInstance.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i += 1) {
          const result = event.results[i];
          if (result.isFinal && result[0]?.transcript) {
            finalTranscript += `${result[0].transcript} `;
          }
        }

        if (!finalTranscript.trim()) {
          return;
        }

        setIsProcessing(true);
        onTranscript(finalTranscript.trim());
        setTimeout(() => {
          setIsProcessing(false);
        }, 500);
      };

      recognitionInstance.onerror = (event: any) => {
        if (event?.error === 'aborted') {
          return;
        }
        if (event?.error === 'no-speech') {
          // Keep listening for user speech instead of failing immediately.
          return;
        }
        setError(`Voice input failed: ${event?.error || 'unknown-error'}`);
        shouldKeepListeningRef.current = false;
        setIsListening(false);
        setIsProcessing(false);
      };

      recognitionInstance.onend = () => {
        if (shouldKeepListeningRef.current) {
          try {
            recognitionInstance.start();
            return;
          } catch {
            // Browser may throw if restarted too quickly.
          }
        }
        setIsListening(false);
      };

      recognitionRef.current = recognitionInstance;
    }

    return () => {
      shouldKeepListeningRef.current = false;
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [language]);

  const toggleListening = () => {
    const recognition = recognitionRef.current;
    if (!recognition) {
      setError('Speech recognition is not supported in this browser. Use Chrome or Edge.');
      return;
    }

    if (isListening) {
      shouldKeepListeningRef.current = false;
      recognition.abort();
      setIsListening(false);
    } else {
      try {
        setError(null);
        shouldKeepListeningRef.current = true;
        recognition.lang = language;
        recognition.start();
        setIsListening(true);
      } catch (error) {
        console.error('Speech recognition error:', error);
        setError('Could not start microphone. Allow mic permission and try again.');
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
        relative w-full py-4 rounded-xl font-semibold transition-all duration-300 text-white
        ${isListening 
          ? 'bg-gradient-to-r from-red-600 to-red-700 shadow-red-500/50 shadow-lg' 
          : isLight
            ? 'bg-[#247B7B] hover:bg-[#274f49] hover:shadow-lg'
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

      {error && (
        <div className="mt-2 text-xs text-red-300">{error}</div>
      )}
    </motion.button>
  );
};

export default VoiceCaptureButton;