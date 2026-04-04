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
  id: number;
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
  id: number;
  username: string;
  email: string;
  role: string;
  department: string;
}

export interface ResourceRoom {
  id: number;
  name: string;
  type: string;
  isAvailable: boolean;
  currentPatientId?: number;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assignedTo: number;
  patientId?: number;
  createdAt: string;
}