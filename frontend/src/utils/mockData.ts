import type { Patient } from '../types/patient';
import type { Staff, StaffAssignment } from '../types/staff';
import type { Zone, Room } from '../types/patient';

export const DEMO_PATIENTS: Patient[] = [
  { id: 1, name: 'Rahul Sharma', age: 45, gender: 'M', chiefComplaint: 'Severe chest pain radiating to left arm, shortness of breath, diaphoresis', triageLevel: 'CRITICAL', status: 'ACTIVE', zoneName: 'Resuscitation Bay', roomCode: 'TR-1', assignedNurse: 'Pooja Sinha', assignedDoctor: 'Dr. Advik Mehta', createdAt: new Date().toISOString() },
  { id: 2, name: 'Priya Patel', age: 28, gender: 'F', chiefComplaint: 'High fever (103°F), severe headache, neck stiffness for 2 days', triageLevel: 'CRITICAL', status: 'ACTIVE', zoneName: 'Resuscitation Bay', roomCode: 'TR-2', assignedNurse: 'Kavya Rao', createdAt: new Date().toISOString() },
  { id: 3, name: 'Amit Kumar', age: 62, gender: 'M', chiefComplaint: 'Sudden onset slurred speech and left-sided weakness, 1 hour ago', triageLevel: 'CRITICAL', status: 'ACTIVE', zoneName: 'Resuscitation Bay', roomCode: 'TR-3', createdAt: new Date().toISOString() },
  { id: 4, name: 'Sneha Reddy', age: 35, gender: 'F', chiefComplaint: 'Deep laceration on right forearm, moderate bleeding, needs suturing', triageLevel: 'URGENT', status: 'ACTIVE', zoneName: 'Acute Care', roomCode: 'AC-1', assignedNurse: 'Ananya Iyer', createdAt: new Date().toISOString() },
  { id: 5, name: 'Vikram Singh', age: 50, gender: 'M', chiefComplaint: 'Persistent abdominal pain, vomiting for 6 hours, dehydration signs', triageLevel: 'URGENT', status: 'ACTIVE', zoneName: 'Acute Care', roomCode: 'AC-2', createdAt: new Date().toISOString() },
  { id: 6, name: 'Meera Joshi', age: 22, gender: 'F', chiefComplaint: 'Asthma exacerbation, wheezing, difficulty breathing, SpO2 91%', triageLevel: 'URGENT', status: 'ACTIVE', zoneName: 'Acute Care', roomCode: 'AC-3', createdAt: new Date().toISOString() },
  { id: 7, name: 'Arjun Nair', age: 19, gender: 'M', chiefComplaint: 'Twisted ankle during sports, swelling, can bear some weight', triageLevel: 'STANDARD', status: 'ACTIVE', zoneName: 'Minor Injuries', roomCode: 'MI-1', createdAt: new Date().toISOString() },
  { id: 8, name: 'Kavita Deshmukh', age: 40, gender: 'F', chiefComplaint: 'Mild sore throat, low-grade fever, cough for 3 days', triageLevel: 'STANDARD', status: 'ACTIVE', zoneName: 'Minor Injuries', roomCode: 'MI-2', createdAt: new Date().toISOString() },
  { id: 9, name: 'Rohan Gupta', age: 30, gender: 'M', chiefComplaint: 'Minor burn on hand from cooking, no blisters, localized redness', triageLevel: 'STANDARD', status: 'ACTIVE', zoneName: 'Minor Injuries', roomCode: 'MI-3', createdAt: new Date().toISOString() },
  { id: 10, name: 'Anita Bansal', age: 55, gender: 'F', chiefComplaint: 'Follow-up for blood pressure medication adjustment', triageLevel: 'STANDARD', status: 'ACTIVE', zoneName: 'Fast Track', roomCode: 'FT-1', createdAt: new Date().toISOString() },
];

export const DEMO_STAFF: Staff[] = [
  { id: 1, fullName: 'Super Administrator', username: 'superadmin', email: 'superadmin@ertriage.com', role: 'ADMIN', department: 'Administration', status: 'ACTIVE' },
  { id: 2, fullName: 'Dr. Aarav Sharma', username: 'aarav.sharma', email: 'aarav.sharma@ertriage.com', role: 'DOCTOR', department: 'Cardiology', status: 'ACTIVE' },
  { id: 3, fullName: 'Dr. Vihaan Patel', username: 'vihaan.patel', email: 'vihaan.patel@ertriage.com', role: 'DOCTOR', department: 'Pulmonology', status: 'ACTIVE' },
  { id: 4, fullName: 'Dr. Advik Mehta', username: 'advik.mehta', email: 'advik.mehta@ertriage.com', role: 'DOCTOR', department: 'Neurology', status: 'ACTIVE' },
  { id: 5, fullName: 'Dr. Arjun Roddy', username: 'arjun.roddy', email: 'arjun.roddy@ertriage.com', role: 'DOCTOR', department: 'Orthopedics', status: 'ACTIVE' },
  { id: 6, fullName: 'Dr. Reyansh Kapoor', username: 'reyansh.kapoor', email: 'reyansh.kapoor@ertriage.com', role: 'DOCTOR', department: 'Gastroenterology', status: 'ACTIVE' },
  { id: 7, fullName: 'Dr. Krish Nair', username: 'krish.nair', email: 'krish.nair@ertriage.com', role: 'DOCTOR', department: 'Surgery', status: 'ACTIVE' },
  { id: 8, fullName: 'Dr. Ishaan Verma', username: 'ishaan.verma', email: 'ishaan.verma@ertriage.com', role: 'DOCTOR', department: 'Endocrinology', status: 'ACTIVE' },
  { id: 9, fullName: 'Dr. Kabir Malhotra', username: 'kabir.malhotra', email: 'kabir.malhotra@ertriage.com', role: 'DOCTOR', department: 'Allergy', status: 'ACTIVE' },
  { id: 10, fullName: 'Dr. Rudra Joshi', username: 'rudra.joshi', email: 'rudra.joshi@ertriage.com', role: 'DOCTOR', department: 'Emergency Department', status: 'ACTIVE' },
  { id: 11, fullName: 'Dr. Anish Gupta', username: 'anish.gupta', email: 'anish.gupta@ertriage.com', role: 'DOCTOR', department: 'General Medicine', status: 'ACTIVE' },
  { id: 12, fullName: 'Dr. Kiara Bansal', username: 'kiara.bansal', email: 'kiara.bansal@ertriage.com', role: 'DOCTOR', department: 'Gynecology', status: 'ACTIVE' },
  { id: 13, fullName: 'Pooja Sinha', username: 'pooja.sinha', email: 'pooja.sinha@ertriage.com', role: 'NURSE', department: 'Emergency Department', status: 'ACTIVE' },
  { id: 14, fullName: 'Ananya Iyer', username: 'ananya.iyer', email: 'ananya.iyer@ertriage.com', role: 'NURSE', department: 'Emergency Department', status: 'ACTIVE' },
  { id: 15, fullName: 'Kavya Rao', username: 'kavya.rao', email: 'kavya.rao@ertriage.com', role: 'NURSE', department: 'Emergency Department', status: 'ACTIVE' },
  { id: 16, fullName: 'Rohit Deshmukh', username: 'rohit.deshmukh', email: 'rohit.deshmukh@ertriage.com', role: 'SUPERVISOR', department: 'Operations', status: 'ACTIVE' },
  { id: 17, fullName: 'Rudrank', username: 'rudrank', email: 'rudrank@ertriage.com', role: 'DOCTOR', department: 'Emergency Department', status: 'ACTIVE' },
  { id: 18, fullName: 'Garüst', username: 'garust', email: 'garust@ertriage.com', role: 'DOCTOR', department: 'Emergency Department', status: 'ACTIVE' },
];

export const DEMO_ZONES: Zone[] = [
  { id: 1, name: 'Resuscitation Bay', severityBand: 'CRITICAL', description: 'Life-threatening emergencies requiring immediate intervention' },
  { id: 2, name: 'Acute Care', severityBand: 'URGENT', description: 'Patients requiring prompt medical attention' },
  { id: 3, name: 'Minor Injuries', severityBand: 'STANDARD', description: 'Non-life-threatening injuries and conditions' },
  { id: 4, name: 'Fast Track', severityBand: 'STANDARD', description: 'Quick assessments and follow-ups' },
];

export const DEMO_ROOMS: Room[] = [
  { id: 1, roomCode: 'TR-1', zoneId: 1, zoneName: 'Resuscitation Bay', equipment: ['Ventilator', 'Monitor', 'Defibrillator'], occupied: true, patientId: 1 },
  { id: 2, roomCode: 'TR-2', zoneId: 1, zoneName: 'Resuscitation Bay', equipment: ['Ventilator', 'Monitor'], occupied: true, patientId: 2 },
  { id: 3, roomCode: 'TR-3', zoneId: 1, zoneName: 'Resuscitation Bay', equipment: ['Monitor', 'Defibrillator', 'IV Stand'], occupied: true, patientId: 3 },
  { id: 4, roomCode: 'AC-1', zoneId: 2, zoneName: 'Acute Care', equipment: ['Monitor', 'IV Stand', 'Suction Machine'], occupied: true, patientId: 4 },
  { id: 5, roomCode: 'AC-2', zoneId: 2, zoneName: 'Acute Care', equipment: ['Monitor', 'IV Stand'], occupied: true, patientId: 5 },
  { id: 6, roomCode: 'AC-3', zoneId: 2, zoneName: 'Acute Care', equipment: ['Monitor', 'Oxygen Supply'], occupied: true, patientId: 6 },
  { id: 7, roomCode: 'AC-4', zoneId: 2, zoneName: 'Acute Care', equipment: ['Monitor', 'IV Stand'], occupied: false },
  { id: 8, roomCode: 'MI-1', zoneId: 3, zoneName: 'Minor Injuries', equipment: ['IV Stand'], occupied: true, patientId: 7 },
  { id: 9, roomCode: 'MI-2', zoneId: 3, zoneName: 'Minor Injuries', equipment: [], occupied: true, patientId: 8 },
  { id: 10, roomCode: 'MI-3', zoneId: 3, zoneName: 'Minor Injuries', equipment: [], occupied: true, patientId: 9 },
  { id: 11, roomCode: 'FT-1', zoneId: 4, zoneName: 'Fast Track', equipment: [], occupied: true, patientId: 10 },
  { id: 12, roomCode: 'FT-2', zoneId: 4, zoneName: 'Fast Track', equipment: [], occupied: false },
];

export const DEMO_ASSIGNMENTS: StaffAssignment[] = [
  { staffId: 4, staffName: 'Dr. Advik Mehta', role: 'DOCTOR', assignedZone: 'Resuscitation Bay', assignedPatients: [{ id: 1, name: 'Rahul Sharma', triageLevel: 'CRITICAL' }] },
  { staffId: 10, staffName: 'Dr. Rudra Joshi', role: 'DOCTOR', assignedZone: 'Resuscitation Bay', assignedPatients: [{ id: 2, name: 'Priya Patel', triageLevel: 'CRITICAL' }, { id: 3, name: 'Amit Kumar', triageLevel: 'CRITICAL' }] },
  { staffId: 5, staffName: 'Dr. Arjun Roddy', role: 'DOCTOR', assignedZone: 'Acute Care', assignedPatients: [{ id: 4, name: 'Sneha Reddy', triageLevel: 'URGENT' }] },
  { staffId: 13, staffName: 'Pooja Sinha', role: 'NURSE', assignedZone: 'Resuscitation Bay', assignedPatients: [{ id: 1, name: 'Rahul Sharma', triageLevel: 'CRITICAL' }] },
  { staffId: 14, staffName: 'Ananya Iyer', role: 'NURSE', assignedZone: 'Acute Care', assignedPatients: [{ id: 4, name: 'Sneha Reddy', triageLevel: 'URGENT' }, { id: 5, name: 'Vikram Singh', triageLevel: 'URGENT' }] },
  { staffId: 15, staffName: 'Kavya Rao', role: 'NURSE', assignedZone: 'Resuscitation Bay', assignedPatients: [{ id: 2, name: 'Priya Patel', triageLevel: 'CRITICAL' }] },
];
