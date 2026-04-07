import { useCallback, useRef, useState } from 'react';
import { patientAPI } from '../services/api';

export interface CloudVoiceRecordingState {
  isRecording: boolean;
  processing: boolean;
  error: string | null;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<string>;
}

export function useCloudVoiceRecording(): CloudVoiceRecordingState {
  const [isRecording, setIsRecording] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  const startRecording = useCallback(async () => {
    setError(null);
    if (!navigator.mediaDevices?.getUserMedia) {
      setError('Microphone not available in this browser.');
      return;
    }
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mime =
      MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
          ? 'audio/webm'
          : '';
    const rec = mime
      ? new MediaRecorder(stream, { mimeType: mime })
      : new MediaRecorder(stream);
    chunksRef.current = [];
    rec.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    rec.start(100);
    mediaRecorderRef.current = rec;
    setIsRecording(true);
  }, []);

  const stopRecording = useCallback(async (): Promise<string> => {
    const rec = mediaRecorderRef.current;
    if (!rec || rec.state === 'inactive') {
      setIsRecording(false);
      return '';
    }

    return new Promise((resolve, reject) => {
      rec.onstop = async () => {
        mediaRecorderRef.current = null;
        setIsRecording(false);
        rec.stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: rec.mimeType || 'audio/webm' });
        chunksRef.current = [];
        if (blob.size < 256) {
          resolve('');
          return;
        }
        setProcessing(true);
        setError(null);
        try {
          const text = await patientAPI.transcribeVoice(blob, rec.mimeType || blob.type);
          resolve(text);
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : 'Transcription failed';
          setError(msg);
          reject(e);
        } finally {
          setProcessing(false);
        }
      };
      try {
        rec.stop();
      } catch (err) {
        setIsRecording(false);
        reject(err);
      }
    });
  }, []);

  return { isRecording, processing, error, startRecording, stopRecording };
}