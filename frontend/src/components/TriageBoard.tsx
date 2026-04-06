import { useState, useCallback } from 'react';
import { Patient, TriageLevel } from '../types';
import PatientCard from './PatientCard';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSkullCrossbones, FaExclamationTriangle, FaShieldAlt } from 'react-icons/fa';
import { GripVertical } from 'lucide-react';
import { useTheme } from '../hooks/contexts/ThemeContext';
import {
  DndContext,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  rectIntersection,
  useDroppable,
  CollisionDetection,
} from '@dnd-kit/core';
import { useDraggable } from '@dnd-kit/core';

// Column IDs that are valid drop targets
const COLUMN_IDS = new Set([TriageLevel.CRITICAL, TriageLevel.URGENT, TriageLevel.STANDARD]);

// Custom collision detection that only considers column droppables (not individual cards)
const columnsOnlyCollision: CollisionDetection = (args) => {
  const filteredDroppables = args.droppableContainers.filter(
    (container) => COLUMN_IDS.has(String(container.id) as TriageLevel)
  );
  return rectIntersection({
    ...args,
    droppableContainers: filteredDroppables,
  });
};

interface TriageBoardProps {
  patients: Patient[];
  onPatientUpdate: () => void;
  onTriageLevelChange: (patientId: string, newLevel: TriageLevel) => void;
  isDragging: boolean;
  setIsDragging: (dragging: boolean) => void;
}

const TriageBoard: React.FC<TriageBoardProps> = ({
  patients,
  onPatientUpdate,
  onTriageLevelChange,
  isDragging,
  setIsDragging,
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [activePatient, setActivePatient] = useState<Patient | null>(null);
  const [overColumnId, setOverColumnId] = useState<string | null>(null);

  // Sensors: require 8px movement before drag starts (prevents accidental drags / click conflicts)
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 8 },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 200, tolerance: 6 },
  });
  const sensors = useSensors(pointerSensor, touchSensor);

  const criticalPatients = patients.filter(p => p.triageLevel === TriageLevel.CRITICAL);
  const urgentPatients = patients.filter(p => p.triageLevel === TriageLevel.URGENT);
  const standardPatients = patients.filter(p => p.triageLevel === TriageLevel.STANDARD);

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

  function handleDragStart(event: DragStartEvent) {
    const patient = patients.find(p => p.id === String(event.active.id));
    if (patient) {
      setActivePatient(patient);
      setIsDragging(true);
    }
  }

  function handleDragOver(event: DragOverEvent) {
    const overId = event.over?.id;
    if (overId) {
      setOverColumnId(String(overId));
    } else {
      setOverColumnId(null);
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActivePatient(null);
    setOverColumnId(null);
    setIsDragging(false);

    if (!over) return; // dropped outside any column

    const patientId = String(active.id);
    const targetLevel = String(over.id) as TriageLevel;
    const patient = patients.find(p => p.id === patientId);

    if (!patient) return;
    if (patient.triageLevel === targetLevel) return; // same column — no-op

    onTriageLevelChange(patientId, targetLevel);
  }

  function handleDragCancel() {
    setActivePatient(null);
    setOverColumnId(null);
    setIsDragging(false);
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className={`text-2xl font-bold ${isLight ? 'text-[#1a2e2e]' : 'gradient-text'}`}>Live Triage Dashboard</h2>
        <div className={`flex items-center gap-2 text-xs ${isLight ? 'text-[#94a3a3]' : 'text-white/40'}`}>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          {isDragging ? (
            <span className="text-primary-400 font-medium">Drag mode — auto-refresh paused</span>
          ) : (
            'Auto-refreshes every 4s'
          )}
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={columnsOnlyCollision}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {columns.map((column, idx) => (
            <DroppableColumn
              key={column.id}
              column={column}
              idx={idx}
              isLight={isLight}
              isOver={overColumnId === column.id}
              activePatientId={activePatient?.id ?? null}
              onUpdate={onPatientUpdate}
            />
          ))}
        </div>

        {/* Floating drag overlay — renders outside normal flow */}
        <DragOverlay dropAnimation={{
          duration: 300,
          easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
        }}>
          {activePatient ? (
            <div className="drag-overlay-card rounded-xl">
              <PatientCard
                patient={activePatient}
                onUpdate={() => {}}
                isOverlay
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

/* ─── Droppable Column ─── */
interface DroppableColumnProps {
  column: {
    id: string;
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    bgGradient: string;
    lightBg: string;
    borderColor: string;
    lightBorder: string;
    iconColor: string;
    patients: Patient[];
  };
  idx: number;
  isLight: boolean;
  isOver: boolean;
  activePatientId: string | null;
  onUpdate: () => void;
}

function DroppableColumn({ column, idx, isLight, isOver, activePatientId, onUpdate }: DroppableColumnProps) {
  const { setNodeRef, isOver: dndIsOver } = useDroppable({
    id: column.id,
  });

  const highlighted = isOver || dndIsOver;

  return (
    <motion.div
      ref={setNodeRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.1 }}
      className={`
        glass-card overflow-hidden droppable-column
        ${isLight ? `border-t-4 ${column.lightBorder}` : `border-t-4 border-${column.color}-500`}
        ${highlighted ? 'droppable-over' : ''}
      `}
    >
      <div className={`p-4 border-b ${
        isLight
          ? `${column.lightBg} ${column.lightBorder}`
          : `bg-gradient-to-r ${column.bgGradient} ${column.borderColor}`
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <column.icon className={`text-xl ${column.iconColor}`} />
            <h3 className="font-bold text-lg theme-text">{column.title}</h3>
          </div>
          <span className={`status-badge status-${column.color}`}>
            {column.patients.length} patients
          </span>
        </div>
        <p className={`text-xs mt-1 ${isLight ? 'text-[#94a3a3]' : 'text-white/40'}`}>
          {column.title === 'CRITICAL' && 'Immediate action required'}
          {column.title === 'URGENT' && 'Monitor closely'}
          {column.title === 'STANDARD' && 'Safe to wait'}
        </p>
      </div>

      <div className="p-3 max-h-[600px] overflow-y-auto space-y-3">
        {/* Drop indicator when column is highlighted and empty */}
        {highlighted && column.patients.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`drop-indicator rounded-xl border-2 border-dashed p-6 text-center ${
              isLight
                ? 'border-[#247B7B]/30 text-[#247B7B]/50'
                : 'border-primary-500/30 text-primary-400/50'
            }`}
          >
            <p className="text-sm font-medium">Drop patient here</p>
          </motion.div>
        )}

        {column.patients.length === 0 && !highlighted ? (
          <div className={`text-center py-8 text-sm ${isLight ? 'text-[#b0bfbf]' : 'text-white/30'}`}>
            No patients in this category
          </div>
        ) : (
          column.patients.map((patient) => (
            <DraggablePatientCard
              key={patient.id}
              patient={patient}
              onUpdate={onUpdate}
              isBeingDragged={activePatientId === patient.id}
            />
          ))
        )}

        {/* Drop indicator when column has patients and is highlighted */}
        {highlighted && column.patients.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className={`drop-indicator rounded-xl border-2 border-dashed p-4 text-center ${
              isLight
                ? 'border-[#247B7B]/30 text-[#247B7B]/50'
                : 'border-primary-500/30 text-primary-400/50'
            }`}
          >
            <p className="text-xs font-medium">Drop here to move to {column.title}</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

/* ─── Draggable Patient Card Wrapper ─── */
interface DraggablePatientCardProps {
  patient: Patient;
  onUpdate: () => void;
  isBeingDragged: boolean;
}

function DraggablePatientCard({ patient, onUpdate, isBeingDragged }: DraggablePatientCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
  } = useDraggable({
    id: patient.id,
  });

  const style: React.CSSProperties = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group ${isBeingDragged ? 'dragging-source' : ''}`}
    >
      {/* Drag handle indicator */}
      <div
        {...listeners}
        {...attributes}
        className="absolute left-0 top-0 bottom-0 w-8 z-10 flex items-center justify-center cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
        title="Drag to move"
      >
        <GripVertical size={14} className="text-white/30 group-hover:text-white/60" />
      </div>
      <PatientCard patient={patient} onUpdate={onUpdate} />
    </div>
  );
}

export default TriageBoard;