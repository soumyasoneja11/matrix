export type TriageLevel = 'CRITICAL' | 'URGENT' | 'STANDARD';

export interface Patient {
  id: string; // Unified to string for MongoDB compatibility
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
  id: string;
  name: string;
  severityBand: TriageLevel;
  description: string;
}

export interface Room {
  id: string;
  roomCode: string;
  zoneId: string;
  zoneName: string;
  equipment: string[];
  occupied: boolean;
  patientId?: string;
}
