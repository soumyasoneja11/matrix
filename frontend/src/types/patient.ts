/* ──────────────────────────────────────────────
   Domain types for the Patient Registration /
   QR-clinic flow.
   ────────────────────────────────────────────── */

/** Triage severity levels */
export type TriageLevel = 'GREEN' | 'YELLOW' | 'ORANGE' | 'RED';

/** Gender enum matching backend */
export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

/** Patient registration payload (sent to the API) */
export interface PatientRegistrationRequest {
  firstName: string;
  lastName: string;
  dateOfBirth: string;          // ISO-8601 date string
  gender: Gender;
  phone: string;
  email?: string;
  address?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  chiefComplaint: string;
  triageLevel?: TriageLevel;
}

/** Full patient entity returned by the API */
export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: Gender;
  phone: string;
  email?: string;
  address?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  chiefComplaint: string;
  triageLevel: TriageLevel;
  qrCode: string;               // Base64 / data-url or unique token
  registeredAt: string;          // ISO-8601 timestamp
  status: PatientStatus;
}

/** Patient workflow status */
export type PatientStatus =
  | 'REGISTERED'
  | 'WAITING'
  | 'IN_CONSULTATION'
  | 'DISCHARGED';

/** WebSocket event pushed to the clinic dashboard */
export interface PatientEvent {
  type: 'PATIENT_REGISTERED' | 'PATIENT_UPDATED' | 'PATIENT_CALLED';
  patient: Patient;
  timestamp: string;
}

/** QR scan result */
export interface QRScanResult {
  patientId: string;
  decodedText: string;
}
