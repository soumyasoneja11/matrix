import { useCallback, useEffect, useRef, useState } from 'react';

/* ──────────────────────────────────────────────
   Web Speech API hook
   ────────────────────────────────────────────── */

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface UseVoiceRecognitionOptions {
  /** Language / locale, default en-US */
  lang?: string;
  /** Fire continuously while speaking */
  continuous?: boolean;
  /** Return interim (partial) results */
  interimResults?: boolean;
  /** Called with each final transcript chunk */
  onResult?: (transcript: string) => void;
  /** Called when an error occurs */
  onError?: (error: string) => void;
}

interface UseVoiceRecognitionReturn {
  /** Whether the browser supports Web Speech API */
  isSupported: boolean;
  /** Whether the recogniser is currently listening */
  isListening: boolean;
  /** Accumulated transcript */
  transcript: string;
  /** Interim (partial) transcript */
  interimTranscript: string;
  /** Start listening */
  startListening: () => void;
  /** Stop listening */
  stopListening: () => void;
  /** Clear all transcripts */
  resetTranscript: () => void;
}

export function useVoiceRecognition(
  options: UseVoiceRecognitionOptions = {},
): UseVoiceRecognitionReturn {
  const {
    lang = 'en-US',
    continuous = true,
    interimResults = true,
    onResult,
    onError,
  } = options;

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  const SpeechRecognition =
    typeof window !== 'undefined'
      ? (window as any).SpeechRecognition ??
        (window as any).webkitSpeechRecognition
      : null;

  const isSupported = !!SpeechRecognition;

  /* ── Initialise recognition instance ─────── */
  useEffect(() => {
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = lang;
    recognition.continuous = continuous;
    recognition.interimResults = interimResults;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalText = '';
      let interim = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalText += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }

      if (finalText) {
        setTranscript((prev) => prev + finalText);
        onResult?.(finalText);
      }
      setInterimTranscript(interim);
    };

    recognition.onerror = (event: any) => {
      const msg = event.error ?? 'Unknown speech recognition error';
      onError?.(msg);
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, continuous, interimResults]);

  /* ── Controls ────────────────────────────── */
  const startListening = useCallback(() => {
    if (!recognitionRef.current || isListening) return;
    recognitionRef.current.start();
    setIsListening(true);
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    recognitionRef.current.stop();
    setIsListening(false);
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
  }, []);

  return {
    isSupported,
    isListening,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    resetTranscript,
  };
}
