import React, { useEffect, useState } from 'react';
import { useWebSocket } from '../../hooks/useWebSocket';
import { getAllPatients, updatePatientStatus } from '../../services/api';
import type { Patient, PatientEvent } from '../../types/patient';

/* ──────────────────────────────────────────────
   Clinic Dashboard — real-time patient list
   with WebSocket updates
   ────────────────────────────────────────────── */

const ClinicDashboard: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  /* ── Load initial patient list ───────────── */
  useEffect(() => {
    getAllPatients()
      .then(setPatients)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  /* ── WebSocket real-time updates ─────────── */
  const handleWsMessage = (event: PatientEvent) => {
    setPatients((prev) => {
      switch (event.type) {
        case 'PATIENT_REGISTERED':
          // Add new patient to top of list
          return [event.patient, ...prev.filter((p) => p.id !== event.patient.id)];
        case 'PATIENT_UPDATED':
        case 'PATIENT_CALLED':
          return prev.map((p) => (p.id === event.patient.id ? event.patient : p));
        default:
          return prev;
      }
    });
  };

  const { isConnected } = useWebSocket({ onMessage: handleWsMessage });

  /* ── Status change handler ───────────────── */
  const handleStatusChange = async (id: string, status: string) => {
    try {
      const updated = await updatePatientStatus(id, status);
      setPatients((prev) => prev.map((p) => (p.id === id ? updated : p)));
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  /* ── Triage badge color helper ───────────── */
  const triageBadgeClass = (level: string) =>
    `triage-badge triage-badge--${level.toLowerCase()}`;

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner" />
        <p>Loading patients…</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard__header">
        <h2>Clinic Dashboard</h2>
        <span className={`ws-status ${isConnected ? 'ws-status--connected' : 'ws-status--disconnected'}`}>
          {isConnected ? '● Live' : '○ Disconnected'}
        </span>
      </div>

      {/* Patient table */}
      {patients.length === 0 ? (
        <div className="dashboard__empty">
          <p>No patients registered yet.</p>
        </div>
      ) : (
        <div className="dashboard__table-wrapper">
          <table className="dashboard__table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Chief Complaint</th>
                <th>Triage</th>
                <th>Status</th>
                <th>Registered</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p) => (
                <tr key={p.id}>
                  <td>{p.firstName} {p.lastName}</td>
                  <td className="complaint-cell">{p.chiefComplaint}</td>
                  <td>
                    <span className={triageBadgeClass(p.triageLevel)}>
                      {p.triageLevel}
                    </span>
                  </td>
                  <td>
                    <select
                      className="status-select"
                      value={p.status}
                      onChange={(e) => handleStatusChange(p.id, e.target.value)}
                    >
                      <option value="REGISTERED">Registered</option>
                      <option value="WAITING">Waiting</option>
                      <option value="IN_CONSULTATION">In Consultation</option>
                      <option value="DISCHARGED">Discharged</option>
                    </select>
                  </td>
                  <td className="time-cell">
                    {new Date(p.registeredAt).toLocaleTimeString()}
                  </td>
                  <td>
                    <button
                      className="btn btn--sm btn--primary"
                      onClick={() => handleStatusChange(p.id, 'IN_CONSULTATION')}
                    >
                      Call
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ClinicDashboard;
