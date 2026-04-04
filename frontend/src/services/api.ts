import axios from 'axios';
import type { LoginRequest, SignUpRequest, AuthUser, Staff } from '../types/staff';
import type { Patient, Zone, Room, TriageRequest } from '../types/patient';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Attach auth token to every request
api.interceptors.request.use((config) => {
  const stored = localStorage.getItem('er_triage_user');
  if (stored) {
    const user: AuthUser = JSON.parse(stored);
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// ── Auth ──────────────────────────────────────
export const authAPI = {
  login: (data: LoginRequest) => api.post<AuthUser>('/auth/login', data),
  signup: (data: SignUpRequest) => api.post<AuthUser>('/auth/signup', data),
  logout: () => api.post('/auth/logout'),
};

// ── Patients ──────────────────────────────────
export const patientAPI = {
  getAll: () => api.get<Patient[]>('/patients'),
  getById: (id: number) => api.get<Patient>(`/patients/${id}`),
  search: (query: string) => api.get<Patient[]>(`/patients/search?q=${encodeURIComponent(query)}`),
  triage: (data: TriageRequest) => api.post<Patient>('/patients/triage', data),
  updateTriageLevel: (id: number, level: string) =>
    api.patch<Patient>(`/patients/${id}/triage-level`, { triageLevel: level }),
  dismiss: (id: number) => api.delete(`/patients/${id}`),
  restore: (id: number) => api.post(`/patients/${id}/restore`),
  permanentDelete: (id: number) => api.delete(`/patients/${id}/permanent`),
  getRecycleBin: () => api.get<Patient[]>('/patients/recycle-bin'),
};

// ── Staff ─────────────────────────────────────
export const staffAPI = {
  getAll: () => api.get<Staff[]>('/staff'),
  getById: (id: number) => api.get<Staff>(`/staff/${id}`),
  create: (data: Partial<Staff>) => api.post<Staff>('/staff', data),
  update: (id: number, data: Partial<Staff>) => api.put<Staff>(`/staff/${id}`, data),
  remove: (id: number) => api.delete(`/staff/${id}`),
  getAssignments: () => api.get('/staff/assignments'),
};

// ── Zones & Rooms ─────────────────────────────
export const zoneAPI = {
  getAll: () => api.get<Zone[]>('/zones'),
  create: (data: Partial<Zone>) => api.post<Zone>('/zones', data),
};

export const roomAPI = {
  getAll: () => api.get<Room[]>('/rooms'),
  create: (data: Partial<Room>) => api.post<Room>('/rooms', data),
  getByZone: (zoneId: number) => api.get<Room[]>(`/zones/${zoneId}/rooms`),
};

// ── Analytics ─────────────────────────────────
export const analyticsAPI = {
  getDashboard: () => api.get('/analytics/dashboard'),
  getPatientFlow: () => api.get('/analytics/patient-flow'),
  getTriageDistribution: () => api.get('/analytics/triage-distribution'),
  getActivityLog: () => api.get('/analytics/activity-log'),
};

// ── Worklist ──────────────────────────────────
export const worklistAPI = {
  getMyWorklist: () => api.get<Patient[]>('/worklist'),
};

export default api;
