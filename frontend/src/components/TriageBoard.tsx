import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Patient, TriageLevel, Vitals } from '../types';
import KanbanColumn from './KanbanColumn';
import ConfirmationModal from './ConfirmationModal';
import ToastNotification from './ToastNotification';
import PatientCard from './PatientCard';
import { AnimatePresence } from 'framer-motion';
import { FaSkullCrossbones, FaExclamationTriangle, FaShieldAlt } from 'react-icons/fa';
import { useTheme } from '../hooks/contexts/ThemeContext';
import {
  DndContext, DragEndEvent, DragStartEvent,
  useSensor, useSensors, PointerSensor, TouchSensor,
  DragOverlay, closestCorners
} from '@dnd-kit/core';
import { patientAPI, updatePatient } from '../services/api';
import { useNotifications } from '../hooks/contexts/NotificationContext';
import { useRecycleBin } from '../hooks/contexts/RecycleBinContext';
import { useAuth } from '../hooks/contexts/AuthContext';

interface TriageBoardProps{
  patients: Patient[];
  onPatientUpdate: () => void;
  setPauseRefresh: (pause: boolean) => void;
}

const TriageBoard: React.FC<TriageBoardProps> = ({ patients, onPatientUpdate, setPauseRefresh }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const { addNotification } = useNotifications();
  const { dischargePatient, isDischarging } = useRecycleBin();
  const { user } = useAuth();

  // committedPatientsRef holds our optimistic update.
  // It is ONLY released (set back to null) when the incoming `patients` prop
  // from the backend actually reflects the move we made — i.e. the patient
  // appears in the correct new column in the server response.
  // Until that happens, we ignore the prop and render from the ref.
  const committedPatientsRef = useRef<Patient[] | null>(null);

  // Tracks the pending move so we know what to verify against incoming props
  const pendingMoveRef = useRef<{ patientId: string; targetLevel: string } | null>(null);

  const [renderTick, setRenderTick] = useState(0);
  const forceRender = () => setRenderTick(t => t + 1);

  const [activePatient, setActivePatient] = useState<Patient | null>(null);
  const [pendingDrop, setPendingDrop] = useState<{
    patientId: string;
    source: string;
    target: string;
    targetLabel: string;
  } | null>(null);

  const [toast, setToast] = useState<{
    id: string; message: string; type: 'success' | 'error'
  } | null>(null);

  // Watch incoming `patients` prop. When the backend data finally reflects
  // our committed move, release the ref and let props take over naturally.
  useEffect(() => {
    if (!committedPatientsRef.current || !pendingMoveRef.current) return;

    const { patientId, targetLevel } = pendingMoveRef.current;
    const incomingPatient = patients.find(p => p.id === patientId);

    if (incomingPatient && incomingPatient.triageLevel === targetLevel) {
      // Backend has confirmed the move — safe to release the ref lock
      committedPatientsRef.current = null;
      pendingMoveRef.current = null;
      setPauseRefresh(false);
      forceRender();
    }
  }, [patients, setPauseRefresh]);

  const displayPatients: Patient[] = committedPatientsRef.current ?? patients;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const patientData = event.active.data.current?.patient;
    if (patientData) {
      setActivePatient(patientData);
      setPauseRefresh(true);
      if (committedPatientsRef.current === null) {
        committedPatientsRef.current = [...patients];
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const draggedPatient = active.data.current?.patient;
    const targetColumnId = over?.id;

    // Same column or invalid drop — no change
    if (!draggedPatient || !targetColumnId || draggedPatient.triageLevel === targetColumnId) {
      committedPatientsRef.current = null;
      setActivePatient(null);
      setPauseRefresh(false);
      return;
    }

    setPendingDrop({
      patientId: draggedPatient.id,
      source: draggedPatient.triageLevel,
      target: String(targetColumnId),
      targetLabel:
        targetColumnId === TriageLevel.CRITICAL ? 'CRITICAL' :
        targetColumnId === TriageLevel.URGENT   ? 'URGENT'   : 'STANDARD',
    });
  };

  const handleConfirmMove = async () => {
    if (!pendingDrop || !activePatient) return;

    const { patientId, target, targetLabel } = pendingDrop;
    const patientName = activePatient.name || 'Patient';

    // 1. Write optimistic update into ref FIRST
    const base = committedPatientsRef.current ?? patients;
    committedPatientsRef.current = base.map(p =>
      p.id === patientId ? { ...p, triageLevel: target as TriageLevel } : p
    );

    // 2. Record what we're waiting for the backend to confirm
    pendingMoveRef.current = { patientId, targetLevel: target };

    forceRender();

    // 3. Clear modal state — ref already holds truth so no revert possible
    setPendingDrop(null);
    setActivePatient(null);

    // 4. Notify both channels
    const successMsg = `${patientName} moved to ${targetLabel}`;
    setToast({ id: Date.now().toString(), message: successMsg, type: 'success' });
    addNotification(successMsg, 'success');

    try {
      await patientAPI.updateTriageLevel(patientId, target);
      // After the API confirms, resume polling so the useEffect can catch
      // the next fetch and release the ref when the data matches
      setPauseRefresh(false);
    } catch (err) {
      console.error('Failed to update triage level:', err);
      // Revert everything on failure
      committedPatientsRef.current = null;
      pendingMoveRef.current = null;
      forceRender();
      const errMsg = `Failed to move ${patientName}. Please try again.`;
      setToast({ id: Date.now().toString(), message: errMsg, type: 'error' });
      addNotification(errMsg, 'error');
      setPauseRefresh(false);
    }
  };

  const handleCancelMove = () => {
    committedPatientsRef.current = null;
    pendingMoveRef.current = null;
    setPendingDrop(null);
    setActivePatient(null);
    setPauseRefresh(false);
  };

  // ── Discharge handler ──
  const handleDischarge = async (patient: Patient) => {
    if (isDischarging) return;

    const currentUser = user?.fullName || 'System';
    const patientName = patient.name || 'Patient';

    // 1. Add to recycle bin context
    dischargePatient(patient, currentUser);

    // 2. Optimistically remove from board
    setPauseRefresh(true);
    const base = committedPatientsRef.current ?? patients;
    committedPatientsRef.current = base.filter(p => p.id !== patient.id);
    forceRender();

    // 3. Notify both channels
    const msg = `Patient ${patientName} discharged by ${currentUser}`;
    setToast({ id: Date.now().toString(), message: msg, type: 'success' });
    addNotification(msg, 'info');

    // 4. Call API
    try {
      await patientAPI.dismiss(patient.id);
    } catch (err) {
      console.error('Failed to discharge patient on backend:', err);
      // The patient is already in recycle bin locally, so we don't revert that
      // But we do show an error
      const errMsg = `Discharge saved locally. Backend sync may be pending.`;
      setToast({ id: Date.now().toString(), message: errMsg, type: 'error' });
      addNotification(errMsg, 'error');
    }

    // 5. Release ref and refresh
    committedPatientsRef.current = null;
    setPauseRefresh(false);
    onPatientUpdate();
  };

  // ── Handoff handler ──
  const handleHandoff = async (patient: Patient, doctor: string, nurse: string) => {
    const patientName = patient.name || 'Patient';

    // 1. Optimistically update the board
    setPauseRefresh(true);
    const base = committedPatientsRef.current ?? patients;
    committedPatientsRef.current = base.map(p =>
      p.id === patient.id
        ? { ...p, assignedDoctor: doctor, assignedNurse: nurse, assignedStaff: doctor }
        : p
    );
    forceRender();

    // 2. Notify both channels
    const msg = `Patient ${patientName} handed off to ${doctor} and ${nurse}`;
    setToast({ id: Date.now().toString(), message: msg, type: 'success' });
    addNotification(msg, 'info');

    // 3. Call API
    try {
      await updatePatient(patient.id, {
        assignedDoctor: doctor,
        assignedNurse: nurse,
        assignedStaff: doctor,
      });
    } catch (err) {
      console.error('Failed to update handoff on backend:', err);
      const errMsg = `Handoff saved locally. Backend sync may be pending.`;
      setToast({ id: Date.now().toString(), message: errMsg, type: 'error' });
      addNotification(errMsg, 'error');
    }

    // 4. Release ref and refresh
    committedPatientsRef.current = null;
    setPauseRefresh(false);
    onPatientUpdate();
  };

  // ── Re-triage handler ──
  const handleReTriage = async (patientId: string, updatedData: {
    description?: string;
    vitals?: Vitals;
    triageLevel: TriageLevel;
  }) => {
    const base = committedPatientsRef.current ?? patients;
    const targetPatient = base.find(p => p.id === patientId);
    if (!targetPatient) return;

    const patientName = targetPatient.name || 'Patient';
    const oldLevel = targetPatient.triageLevel;
    const newLevel = updatedData.triageLevel;

    // 1. Build updated patient
    const updatedPatient: Patient = {
      ...targetPatient,
      description: updatedData.description ?? targetPatient.description,
      vitals: updatedData.vitals ?? targetPatient.vitals,
      triageLevel: newLevel,
    };

    // 2. Optimistic update
    setPauseRefresh(true);
    committedPatientsRef.current = base.map(p =>
      p.id === patientId ? updatedPatient : p
    );
    forceRender();

    // 3. Notify
    const levelChanged = oldLevel !== newLevel;
    const msg = levelChanged
      ? `${patientName} re-triaged: ${oldLevel} → ${newLevel}`
      : `${patientName} vitals updated (priority unchanged)`;
    setToast({ id: Date.now().toString(), message: msg, type: 'success' });
    addNotification(msg, levelChanged ? 'info' : 'info');

    // 4. Persist to backend
    try {
      await updatePatient(patientId, {
        description: updatedData.description,
        vitals: updatedData.vitals,
        triageLevel: newLevel,
      } as any);

      if (levelChanged) {
        await patientAPI.updateTriageLevel(patientId, newLevel);
      }
    } catch (err) {
      console.error('Failed to persist re-triage:', err);
      const errMsg = `Re-triage saved locally. Backend sync may be pending.`;
      setToast({ id: Date.now().toString(), message: errMsg, type: 'error' });
      addNotification(errMsg, 'error');
    }

    // 5. Release and refresh
    committedPatientsRef.current = null;
    setPauseRefresh(false);
    onPatientUpdate();
  };

  const criticalPatients = displayPatients.filter(p => p.triageLevel === TriageLevel.CRITICAL);
  const urgentPatients   = displayPatients.filter(p => p.triageLevel === TriageLevel.URGENT);
  const standardPatients = displayPatients.filter(p => p.triageLevel === TriageLevel.STANDARD);

  const columns = [
    {
      id: TriageLevel.CRITICAL,
      title: 'CRITICAL',
      icon: FaSkullCrossbones,
      color: 'critical',
      bgGradient: 'from-red-600/20 to-red-900/20',
      lightBg: 'bg-red-100/70',
      borderColor: 'border-red-500/30',
      lightBorder: 'border-red-300',
      iconColor: isLight ? 'text-red-600' : 'text-red-400',
      patients: criticalPatients,
    },
    {
      id: TriageLevel.URGENT,
      title: 'URGENT',
      icon: FaExclamationTriangle,
      color: 'urgent',
      bgGradient: 'from-amber-600/20 to-amber-900/20',
      lightBg: 'bg-amber-100/70',
      borderColor: 'border-amber-500/30',
      lightBorder: 'border-amber-300',
      iconColor: isLight ? 'text-amber-600' : 'text-amber-400',
      patients: urgentPatients,
    },
    {
      id: TriageLevel.STANDARD,
      title: 'STANDARD',
      icon: FaShieldAlt,
      color: 'standard',
      bgGradient: 'from-emerald-600/20 to-emerald-900/20',
      lightBg: 'bg-emerald-100/70',
      borderColor: 'border-emerald-500/30',
      lightBorder: 'border-emerald-300',
      iconColor: isLight ? 'text-emerald-600' : 'text-emerald-400',
      patients: standardPatients,
    },
  ];

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className={`text-2xl font-bold ${isLight ? 'text-[#1a2e2e]' : 'gradient-text'}`}>
            Live Triage Dashboard
          </h2>
          <div className={`flex items-center gap-2 text-xs ${isLight ? 'text-[#94a3a3]' : 'text-white/40'}`}>
            <div className={`w-2 h-2 rounded-full ${
              activePatient || pendingDrop ? 'bg-amber-500' : 'bg-green-500 animate-pulse'
            }`} />
            {activePatient || pendingDrop ? 'Auto-refresh paused' : 'Auto-refreshes every 4s'}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {columns.map((col, idx) => (
            <KanbanColumn
              key={col.id}
              {...col}
              onPatientUpdate={onPatientUpdate}
              idx={idx}
              onDischarge={handleDischarge}
              onHandoff={handleHandoff}
              onReTriage={handleReTriage}
            />
          ))}
        </div>
      </div>

      <DragOverlay>
        {activePatient ? (
          <div className="rotate-2 pointer-events-none w-full max-w-sm">
            <PatientCard patient={activePatient} onUpdate={onPatientUpdate} />
          </div>
        ) : null}
      </DragOverlay>

      <ConfirmationModal
        isOpen={!!pendingDrop}
        onConfirm={handleConfirmMove}
        onCancel={handleCancelMove}
        targetPriority={pendingDrop?.targetLabel || ''}
        patientName={activePatient?.name}
      />

      <div className="fixed top-24 right-6 z-[1000] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toast && (
            <ToastNotification
              key={toast.id}
              id={toast.id}
              message={toast.message}
              type={toast.type}
              onClose={() => setToast(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </DndContext>
  );
};

export default TriageBoard;