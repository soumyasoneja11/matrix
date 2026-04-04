export enum TriageLevel {
  CRITICAL = 'CRITICAL',
  URGENT = 'URGENT',
  STANDARD = 'STANDARD',
}

export interface Vitals {
  heartRate?: number;
  bloodPressure?: string;
  temperature?: number;
  oxygenSaturation?: number;
}

export interface Patient {
  id: string;
  name?: string;
  age?: number;
  description: string;
  triageLevel: TriageLevel;
  assignedStaff?: string;
  location?: string;
  vitals?: Vitals;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  department: string;
}

export interface ResourceRoom {
  id: string;
  name: string;
  type: string;
  isAvailable: boolean;
  currentPatientId?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assignedTo: string;
  patientId?: string;
  createdAt: string;
}

export interface TriageRequest {
  patientDetails: string;
  language?: string;
}