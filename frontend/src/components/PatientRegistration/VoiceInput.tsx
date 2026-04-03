import React from 'react';
import { useVoiceRecognition } from '../../hooks/useVoiceRecognition';

/* ──────────────────────────────────────────────
   VoiceInput – Web Speech API wrapper component
   ────────────────────────────────────────────── */

interface VoiceInputProps {
  /** Field label shown above the text area */
  label: string;
  /** Current value (controlled) */
  value: string;
  /** Called when text changes (either typed or dictated) */
  onChange: (value: string) => void;
  /** Placeholder when empty */
  placeholder?: string;
}

const VoiceInput: React.FC<VoiceInputProps> = ({
  label,
  value,
  onChange,
  placeholder = 'Speak or type here…',
}) => {
  const {
    isSupported,
    isListening,
    interimTranscript,
    startListening,
    stopListening,
  } = useVoiceRecognition({
    onResult: (text) => onChange(value + text),
  });

  return (
    <div className="voice-input-group">
      <label className="voice-input-label">{label}</label>

      <div className="voice-input-wrapper">
        <textarea
          className="voice-input-textarea"
          placeholder={placeholder}
          value={isListening ? value + interimTranscript : value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
        />

        {isSupported && (
          <button
            type="button"
            className={`voice-btn ${isListening ? 'voice-btn--active' : ''}`}
            onClick={isListening ? stopListening : startListening}
            title={isListening ? 'Stop listening' : 'Start voice input'}
          >
            {isListening ? (
              /* Animated "listening" icon */
              <span className="voice-icon voice-icon--listening">
                <span className="pulse-ring" />
                🎙️
              </span>
            ) : (
              <span className="voice-icon">🎤</span>
            )}
          </button>
        )}
      </div>

      {isListening && (
        <p className="voice-status">Listening…</p>
      )}
    </div>
  );
};

export default VoiceInput;
