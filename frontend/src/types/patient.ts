export type TriageLevel = 'CRITICAL' | 'URGENT' | 'STANDARD';

export interface Patient {
  id: number;
  name: string;
  age?: number;
  gender?: string;
  chiefComplaint?: string;
  symptoms?: string;
  vitalSigns?: string;
  painLevel?: number;
  triageLevel: TriageLevel;
  status: string;
  zoneName?: string;
  roomCode?: string;
  assignedNurse?: string;
  assignedDoctor?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Zone {
  id: number;
  name: string;
  severityBand: string;
  description?: string;
  rooms?: Room[];
}

export interface Room {
  id: number;
  roomCode: string;
  zoneId: number;
  zoneName?: string;
  equipment: string[];
  occupied: boolean;
  patientId?: number;
}

export interface TriageRequest {
  patientDetails: string;
  language?: string;
}

export interface TriageResponse {
  patient: Patient;
  triageLevel: TriageLevel;
  reasoning?: string;
  suggestedZone?: string;
}
