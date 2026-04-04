import axios, { AxiosError, AxiosResponse } from 'axios';
import { Patient, TriageRequest } from '../types';

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

// Response interceptor for centralized error handling and data unwrapping
api.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<any>>) => {
    // If the backend returns a successful response wrapper, unwrap the data
    if (response.data && typeof response.data === 'object' && 'success' in response.data) {
      if (response.data.success) {
        return { ...response, data: response.data.data };
      }
      // If success is false, throw the message as an error
      return Promise.reject(new Error(response.data.message || 'API Error'));
    }
    return response;
  },
  (error: AxiosError<ApiResponse<any>>) => {
    // Handle error responses (4xx, 5xx)
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

export const createPatient = async (data: { description: string }): Promise<Patient> => {
  const response = await api.post<Patient>('/patients', data);
  return response.data;
};

export const updatePatient = async (id: string, data: Partial<Patient>): Promise<Patient> => {
  const response = await api.put<Patient>(`/patients/${id}`, data);
  return response.data;
};

export const deletePatient = async (id: string): Promise<void> => {
  await api.delete(`/patients/${id}`);
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