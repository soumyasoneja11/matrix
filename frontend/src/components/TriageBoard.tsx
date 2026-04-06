import React, { useState, useRef, useEffect } from 'react';
import { Patient, TriageLevel } from '../types';
import KanbanColumn from './KanbanColumn';
import ConfirmationModal from './ConfirmationModal';
import ToastNotification from './ToastNotification';
import { AnimatePresence } from 'framer-motion';
import { FaSkullCrossbones, FaExclamationTriangle, FaShieldAlt } from 'react-icons/fa';
import { useTheme } from '../hooks/contexts/ThemeContext';
import {
  DndContext, DragEndEvent, DragStartEvent,
  useSensor, useSensors, PointerSensor, TouchSensor,
  DragOverlay, closestCorners
} from '@dnd-kit/core';
import PatientCard from './PatientCard';
import { patientAPI } from '../services/api';
import { useNotifications } from '../hooks/contexts/NotificationContext';

interface TriageBoardProps {
  patients: Patient[];
  onPatientUpdate: () => void;
  setPauseRefresh: (pause: boolean) => void;
}

const TriageBoard: React.FC<TriageBoardProps> = ({ patients, onPatientUpdate, setPauseRefresh }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const { addNotification } = useNotifications();

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

  // ✅ THE CORE FIX:
  // Watch incoming `patients` prop. When the backend data finally reflects
  // our committed move (the patient appears in the correct column), THEN
  // release the ref and let props take over naturally.
  // This means no matter how many 4s polls fire, the card stays put until
  // the server confirms the change — then we hand off cleanly.
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
    // If the incoming data does NOT yet reflect the move, we do nothing —
    // committedPatientsRef keeps holding our optimistic state, and the
    // columns continue to render from it. The next 4s poll will try again.
  }, [patients]);

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

    // 4. Keep refresh PAUSED — it will be unpaused inside the useEffect above
    // once the backend data confirms the move. Do NOT call setPauseRefresh(false) here.

    // 5. Notify both channels
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