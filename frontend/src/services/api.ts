import axios from 'axios';
import type {
  Patient,
  PatientRegistrationRequest,
} from '../types/patient';

/* ──────────────────────────────────────────────
   Axios instance — all API calls go through here
   ────────────────────────────────────────────── */

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
});

/* ── Patient Registration ─────────────────── */

export const registerPatient = async (
  data: PatientRegistrationRequest,
): Promise<Patient> => {
  const res = await api.post<Patient>('/patients/register', data);
  return res.data;
};

/* ── Patient Retrieval ────────────────────── */

export const getPatientById = async (id: string): Promise<Patient> => {
  const res = await api.get<Patient>(`/patients/${id}`);
  return res.data;
};

export const getPatientByQR = async (qrToken: string): Promise<Patient> => {
  const res = await api.get<Patient>('/patients/qr', {
    params: { token: qrToken },
  });
  return res.data;
};

export const getAllPatients = async (): Promise<Patient[]> => {
  const res = await api.get<Patient[]>('/patients');
  return res.data;
};

/* ── Patient Status Update ────────────────── */

export const updatePatientStatus = async (
  id: string,
  status: string,
): Promise<Patient> => {
  const res = await api.patch<Patient>(`/patients/${id}/status`, { status });
  return res.data;
};

export default api;
