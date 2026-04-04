export type Role = 'DOCTOR' | 'SUPERVISOR' | 'NURSE' | 'RECEPTIONIST';

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