import axios from 'axios';
import { Patient } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchPatients = async (): Promise<Patient[]> => {
  const response = await api.get('/patients');
  return response.data;
};

export const createPatient = async (data: { description: string }): Promise<Patient> => {
  const response = await api.post('/patients', data);
  return response.data;
};

export const updatePatient = async (id: number, data: Partial<Patient>): Promise<Patient> => {
  const response = await api.put(`/patients/${id}`, data);
  return response.data;
};

export const deletePatient = async (id: number): Promise<void> => {
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

export const patientAPI = {
  triage: (data: { patientDetails: string; language: string }) =>
    api.post('/patients/triage', data),
  getAll: () => api.get('/patients'),
  getById: (id: number) => api.get(`/patients/${id}`),
  delete: (id: number) => api.delete(`/patients/${id}`),
};

export default api;