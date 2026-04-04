import React from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface VoiceInputProps {
  isListening: boolean;
  onToggle: () => void;
  transcript: string;
  language?: string;
  className?: string;
}

export function VoiceInput({ isListening, onToggle, transcript, language = 'en-US', className = '' }: VoiceInputProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative flex flex-col items-center ${className}`}
    >
      <button
        onClick={onToggle}
        className={`relative w-28 h-28 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${
          isListening
            ? 'bg-gradient-to-br from-red-500 to-red-600 shadow-red-500/40'
            : 'bg-gradient-to-br from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700'
        }`}
      >
        {isListening ? (
          <>
            <motion.span
              className="absolute inset-0 rounded-full bg-red-400/40"
              animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <MicOff size={32} className="text-white" />
          </>
        ) : (
          <Mic size={32} className="text-white" />
        )}
      </button>
      <p className="mt-4 text-sm font-medium text-forest-600">
        {isListening ? 'Listening...' : 'Tap to speak'}
      </p>
      {transcript && (
        <div className="mt-3 p-3 bg-white/60 backdrop-blur-sm rounded-xl text-sm text-forest-700 max-w-xs text-center">
          "{transcript}"
        </div>
      )}
    </motion.div>
  );
}