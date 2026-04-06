export const TriageLevel = {
  CRITICAL: 'CRITICAL',
  URGENT: 'URGENT',
  STANDARD: 'STANDARD',
} as const;

export type TriageLevel = typeof TriageLevel[keyof typeof TriageLevel];

export const PatientStatus = {
  ACTIVE: 'ACTIVE',
  INTAKE: 'INTAKE',
  TRIAGED: 'TRIAGED',
  IN_TREATMENT: 'IN_TREATMENT',
  OBSERVATION: 'OBSERVATION',
  DISCHARGED: 'DISCHARGED',
  DECEASED: 'DECEASED',
} as const;

export type PatientStatus = typeof PatientStatus[keyof typeof PatientStatus];

export type Role = 'ADMIN' | 'DOCTOR' | 'SUPERVISOR' | 'NURSE' | 'RECEPTIONIST';

export type Department =
  | 'EMERGENCY_DEPARTMENT'
  | 'CARDIOLOGY'
  | 'NEUROLOGY'
  | 'ORTHOPEDICS'
  | 'PULMONOLOGY'
  | 'GASTROENTEROLOGY'
  | 'SURGERY'
  | 'ALLERGY'
  | 'ENDOCRINOLOGY'
  | 'GENERAL_MEDICINE'
  | 'GYNECOLOGY'
  | 'ADMINISTRATION'
  | 'OPERATIONS'
  | 'FRONT_DESK';

export interface Vitals {
  heartRate?: number;
  bloodPressure?: string;
  temperature?: number;
  oxygenSaturation?: number;
}

export interface Patient {
  id: string;
  name: string;
  age?: number;
  gender?: string;
  chiefComplaint?: string;
  description?: string;
  triageLevel: TriageLevel;
  priority?: 'RED' | 'ORANGE' | 'YELLOW' | 'GREEN' | 'BLUE'; // ← ADD THIS
  status?: string;
  zoneName?: string;
  roomCode?: string;
  assignedNurse?: string;
  assignedDoctor?: string;
  assignedNurseId?: string;
  assignedDoctorId?: string;
  symptoms?: string[];
  vitals?: Vitals;
  assignedStaff?: string;
  location?: string;
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
  name?: string;
  email?: string;
  phoneNumber?: string;
  symptoms?: string;
  patientDetails?: string;
  language?: string;
}

export interface Staff {
  id: string; // Unified to string for MongoDB compatibility
  fullName: string;
  username: string;
  email: string;
  role: string;
  department: string;
  status?: 'online' | 'busy' | 'offline' | 'ACTIVE';
  avatar?: string;
}

export interface SignupPayload {
  fullName: string;
  username: string;
  email: string;
  password: string;
  role: Role;
  department: string;
}

export interface AuthUser {
  id: string; // Unified to string
  username: string;
  fullName: string;
  email: string;
  role: string;
  department: string;
  token: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface SignUpRequest {
  fullName: string;
  username: string;
  email: string;
  password: string;
  role: Role;
  department: string;
}

export interface StaffAssignment {
  staffId: string; // Unified to string
  staffName: string;
  role: string;
  assignedZone: string;
  assignedPatients: { id: string; name: string; triageLevel: string }[];
}

export interface PatientHistoryVisit {
  id: string;
  date: string;
  complaint: string;
  symptoms: string[];
  vitals?: Vitals;
  triageLevel: TriageLevel;
  assignedDoctor?: string;
  assignedNurse?: string;
  department?: string;
  medicines?: string[];
  procedures?: string[];
  notes?: string;
  status: 'completed' | 'ongoing' | 'follow-up';
}

export interface PatientHistoryRecord {
  id: string;
  name: string;
  age?: number;
  gender?: string;
  contactPhone?: string;
  contactEmail?: string;
  visits: PatientHistoryVisit[];
}