export type TriageLevel = 'CRITICAL' | 'URGENT' | 'STANDARD';

export interface Patient {
  id: number | string;
  name: string;
  age?: number;
  gender?: string;
  chiefComplaint?: string;
  triageLevel: TriageLevel;
  status?: string;
  zoneName?: string;
  roomCode?: string;
  assignedNurse?: string;
  assignedDoctor?: string;
  symptoms?: string[];
  vitals?: {
    heartRate?: number;
    bloodPressure?: string;
    temperature?: number;
    oxygenSaturation?: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface Zone {
  id: number;
  name: string;
  severityBand: TriageLevel;
  description: string;
}

export interface Room {
  id: number;
  roomCode: string;
  zoneId: number;
  zoneName: string;
  equipment: string[];
  occupied: boolean;
  patientId?: number;
}