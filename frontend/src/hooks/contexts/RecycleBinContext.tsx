import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Patient } from '../../types';

export interface DischargedPatient {
  patient: Patient;
  dischargedBy: string;
  dischargedAt: string; // ISO string
  retentionDays: number;
}

interface RecycleBinContextType {
  dischargedPatients: DischargedPatient[];
  isDischarging: boolean;
  dischargePatient: (patient: Patient, dischargedBy: string) => void;
  restorePatient: (patientId: string) => Patient | null;
  permanentDelete: (patientId: string) => void;
  isPatientDischarged: (patientId: string) => boolean;
}

const STORAGE_KEY = 'er_triage_recycle_bin';
const RETENTION_DAYS = 10;

const RecycleBinContext = createContext<RecycleBinContextType | undefined>(undefined);

function loadFromStorage(): DischargedPatient[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // Corrupted storage — ignore
  }
  return [];
}

function saveToStorage(data: DischargedPatient[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Storage full — ignore silently
  }
}

export const RecycleBinProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dischargedPatients, setDischargedPatients] = useState<DischargedPatient[]>(loadFromStorage);
  const [isDischarging, setIsDischarging] = useState(false);

  // Sync to localStorage whenever the list changes
  useEffect(() => {
    saveToStorage(dischargedPatients);
  }, [dischargedPatients]);

  const dischargePatient = useCallback((patient: Patient, dischargedBy: string) => {
    // Guard: prevent double-discharge
    setIsDischarging(true);

    setDischargedPatients(prev => {
      // Already exists? Skip
      if (prev.some(dp => dp.patient.id === patient.id)) {
        setIsDischarging(false);
        return prev;
      }

      const entry: DischargedPatient = {
        patient: { ...patient },
        dischargedBy,
        dischargedAt: new Date().toISOString(),
        retentionDays: RETENTION_DAYS,
      };

      setIsDischarging(false);
      return [entry, ...prev];
    });
  }, []);

  const restorePatient = useCallback((patientId: string): Patient | null => {
    let restored: Patient | null = null;

    setDischargedPatients(prev => {
      const entry = prev.find(dp => dp.patient.id === patientId);
      if (entry) {
        restored = { ...entry.patient };
        return prev.filter(dp => dp.patient.id !== patientId);
      }
      return prev;
    });

    return restored;
  }, []);

  const permanentDelete = useCallback((patientId: string) => {
    setDischargedPatients(prev => prev.filter(dp => dp.patient.id !== patientId));
  }, []);

  const isPatientDischarged = useCallback((patientId: string) => {
    return dischargedPatients.some(dp => dp.patient.id === patientId);
  }, [dischargedPatients]);

  return (
    <RecycleBinContext.Provider value={{
      dischargedPatients,
      isDischarging,
      dischargePatient,
      restorePatient,
      permanentDelete,
      isPatientDischarged,
    }}>
      {children}
    </RecycleBinContext.Provider>
  );
};

export const useRecycleBin = () => {
  const ctx = useContext(RecycleBinContext);
  if (!ctx) throw new Error('useRecycleBin must be used within a RecycleBinProvider');
  return ctx;
};
