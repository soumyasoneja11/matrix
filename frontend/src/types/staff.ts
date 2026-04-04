export type Role = 'ADMIN' | 'DOCTOR' | 'SUPERVISOR' | 'NURSE' | 'RECEPTIONIST';

export interface Staff {
  id: number;
  fullName: string;
  username: string;
  email: string;
  role: Role;
  department: string;
  status: 'ACTIVE' | 'INACTIVE' | 'ON_CALL';
  assignedZone?: string;
  assignedPatients?: number[];
}

export interface StaffAssignment {
  staffId: number;
  staffName: string;
  role: Role;
  assignedZone?: string;
  assignedPatients: { id: number; name: string; triageLevel: string }[];
}

export interface AuthUser {
  id: number;
  username: string;
  fullName: string;
  email: string;
  role: Role;
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
