import axios, { AxiosError, AxiosResponse } from 'axios';
import { Patient, TriageRequest, Staff } from '../types';

// Standardized API Response interface matching backend
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach JWT token from localStorage to every request
api.interceptors.request.use((config) => {
  const stored = localStorage.getItem('er_triage_user');
  if (stored) {
    try {
      const user = JSON.parse(stored);
      if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    } catch {
      // Corrupted storage — ignore
    }
  }
  return config;
});

// Response interceptor for centralized error handling and data unwrapping
api.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<any>>) => {
    if (response.data && typeof response.data === 'object' && 'success' in response.data) {
      if (response.data.success) {
        return { ...response, data: response.data.data };
      }
      return Promise.reject(new Error(response.data.message || 'API Error'));
    }
    return response;
  },
  async (error: AxiosError<ApiResponse<any>>) => {
    const config = error.config as any;
    
    // Simple retry logic for AI extraction (which can be flaky or timeout)
    if (config && config.url?.includes('/triage') && (!config._retry || config._retry < 2)) {
      config._retry = (config._retry || 0) + 1;
      console.warn(`[API Retry] Triage failed, retrying attempt ${config._retry}...`);
      return api(config);
    }

    const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
    console.error('[API Error]:', message);
    return Promise.reject(new Error(message));
  }
);

export const patientAPI = {
  getAll: () => api.get<Patient[]>('/patients'),
  getById: (id: string) => api.get<Patient>(`/patients/${id}`),
  search: (query: string) => api.get<Patient[]>(`/patients/search?q=${encodeURIComponent(query)}`),
  triage: (data: TriageRequest) => api.post<Patient>('/patients/triage', data),
  updateTriageLevel: (id: string, level: string) =>
    api.patch<Patient>(`/patients/${id}/triage-level`, { triageLevel: level }),
  dismiss: (id: string) => api.delete(`/patients/${id}`),
  restore: (id: string) => api.post(`/patients/${id}/restore`),
  permanentDelete: (id: string) => api.delete(`/patients/${id}/permanent`),
  getRecycleBin: () => api.get<Patient[]>('/patients/recycle-bin'),
};

// Legacy/Compatibility wrappers (updated to use the new api instance and string IDs)
export const fetchPatients = async (): Promise<Patient[]> => {
  const response = await api.get<Patient[]>('/patients');
  return response.data;
};

export const staffAPI = {
  getAll: () => api.get<Staff[]>('/staff'),
  getById: (id: string) => api.get<Staff>(`/staff/${id}`),
  create: (data: Partial<Staff>) => api.post<Staff>('/staff', data),
  update: (id: string, data: Partial<Staff>) => api.put<Staff>(`/staff/${id}`, data),
  remove: (id: string) => api.delete(`/staff/${id}`),
  getAssignments: () => api.get('/staff/assignments'),
};

export const createPatient = async (data: TriageRequest): Promise<Patient> => {
  const response = await api.post<Patient>('/patients/triage', data);
  return response.data;
};

export const updatePatient = async (id: string, data: Partial<Patient>): Promise<Patient> => {
  const response = await api.put<Patient>(`/patients/${id}`, data);
  return response.data;
};

export const deletePatient = async (id: string): Promise<void> => {
  await api.delete(`/patients/${id}`);
};

export const worklistAPI = {
  getMyWorklist: () => api.get<Patient[]>('/patients/my-worklist'),
};

export const authAPI = {
  login: (data: { username: string; password: string }) =>
    api.post('/auth/login', data),
  signup: (data: {
    fullName: string;
    username: string;
    email: string;
    password: string;
    role: string;
    department: string;
  }) => api.post('/auth/signup', data),
};


export default api;