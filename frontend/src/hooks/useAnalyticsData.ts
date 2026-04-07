import { useState, useCallback, useEffect } from 'react';
import { historyAPI, patientAPI, type PatientHistoryRecordApi } from '../services/api';
import type { Patient } from '../types';

export interface PriorityItem {
  label: string;
  key: string;
  count: number;
  percentage: number;
  color: string;
  bgColor: string;
}

export interface EventTypeItem {
  label: string;
  count: number;
  icon: string;
}

export interface ActivityEntry {
  id: number;
  eventType: string;
  badgeClass: string;
  description: string;
  actor: string;
  timestamp: string;
}

export interface AnalyticsSummary {
  totalPatients: number;
  todaysIntake: number;
  discharges: number;
  handoffs: number;
  averageAge: number;
  totalEvents: number;
  priorityDistribution: PriorityItem[];
  eventTypes: EventTypeItem[];
  recentActivity: ActivityEntry[];
}

const formatTimestamp = (date: Date): string => {
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const isToday = (value?: string) => {
  if (!value) return false;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return false;
  const now = new Date();
  return d.getFullYear() === now.getFullYear()
    && d.getMonth() === now.getMonth()
    && d.getDate() === now.getDate();
};

const pickDate = (patient: Patient): Date | null => {
  const raw = patient.updatedAt || patient.createdAt;
  if (!raw) return null;
  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const computeAnalytics = (patients: Patient[], historyRecords: PatientHistoryRecordApi[]): AnalyticsSummary => {
  const totalPatients = patients.length;

  const criticalCount = patients.filter(p => p.triageLevel === 'CRITICAL').length;
  const urgentCount = patients.filter(p => p.triageLevel === 'URGENT').length;
  const standardCount = patients.filter(p => p.triageLevel === 'STANDARD').length;

  const ages = patients.map(p => p.age ?? 0).filter(a => a > 0);
  const averageAge = ages.length > 0 ? Math.round(ages.reduce((s, a) => s + a, 0) / ages.length) : 0;

  const todaysIntake = patients.filter(p => isToday(p.createdAt)).length;
  const discharges = patients.filter(p => (p.status || '').toUpperCase() === 'DISCHARGED').length;
  const handoffs = historyRecords.reduce((sum, record) => {
    const handoffCount = (record.visits || []).filter(v =>
      ((v.notes || '') + ' ' + (v.complaint || '')).toLowerCase().includes('handoff')
    ).length;
    return sum + handoffCount;
  }, 0);

  const totalEvents = historyRecords.reduce((sum, record) => sum + (record.visits?.length || 0), 0);

  const priorityDistribution: PriorityItem[] = [
    {
      label: 'RED',
      key: 'critical',
      count: criticalCount,
      percentage: totalPatients > 0 ? Math.round((criticalCount / totalPatients) * 100) : 0,
      color: '#ef4444',
      bgColor: 'bg-red-500',
    },
    {
      label: 'YELLOW',
      key: 'urgent',
      count: urgentCount,
      percentage: totalPatients > 0 ? Math.round((urgentCount / totalPatients) * 100) : 0,
      color: '#f59e0b',
      bgColor: 'bg-amber-500',
    },
    {
      label: 'GREEN',
      key: 'standard',
      count: standardCount,
      percentage: totalPatients > 0 ? Math.round((standardCount / totalPatients) * 100) : 0,
      color: '#10b981',
      bgColor: 'bg-emerald-500',
    },
  ];

  const eventTypes: EventTypeItem[] = [
    { label: 'Resource Allocation', count: patients.filter(p => !!p.zoneName || !!p.roomCode).length, icon: '🏗️' },
    { label: 'Intake', count: todaysIntake, icon: '📋' },
    { label: 'Reassessment', count: Math.max(totalEvents - todaysIntake, 0), icon: '🔄' },
    { label: 'Priority Change', count: historyRecords.reduce((sum, record) => {
      const count = (record.visits || []).filter(v => (v.notes || '').toLowerCase().includes('triage')).length;
      return sum + count;
    }, 0), icon: '⚡' },
  ];

  const recentActivity: ActivityEntry[] = patients
    .map((patient) => {
      const d = pickDate(patient);
      if (!d) return null;
      const isDischarged = (patient.status || '').toUpperCase() === 'DISCHARGED';
      const isAllocated = Boolean(patient.zoneName || patient.roomCode);
      const eventType = isDischarged ? 'Discharge' : isAllocated ? 'Resource Allocation' : 'Intake';
      return {
        id: Number.parseInt(String(patient.id).replace(/\D/g, ''), 10) || d.getTime(),
        eventType,
        badgeClass:
          eventType === 'Discharge'
            ? 'from-purple-500 to-pink-500'
            : eventType === 'Resource Allocation'
              ? 'from-blue-500 to-cyan-500'
              : 'from-green-500 to-emerald-500',
        description:
          eventType === 'Discharge'
            ? `${patient.name} discharged from care`
            : eventType === 'Resource Allocation'
              ? `${patient.name} assigned to ${patient.zoneName || 'care zone'} ${patient.roomCode ? `(${patient.roomCode})` : ''}`.trim()
              : `New intake for ${patient.name} (${patient.triageLevel})`,
        actor: patient.assignedStaff || 'System',
        timestamp: formatTimestamp(d),
        _time: d.getTime(),
      };
    })
    .filter((entry): entry is ActivityEntry & { _time: number } => Boolean(entry))
    .sort((a, b) => b._time - a._time)
    .slice(0, 12)
    .map(({ _time, ...entry }) => entry);

  return {
    totalPatients,
    todaysIntake,
    discharges,
    handoffs,
    averageAge,
    totalEvents,
    priorityDistribution,
    eventTypes,
    recentActivity,
  };
};

export const useAnalyticsData = () => {
  const [data, setData] = useState<AnalyticsSummary>({
    totalPatients: 0,
    todaysIntake: 0,
    discharges: 0,
    handoffs: 0,
    averageAge: 0,
    totalEvents: 0,
    priorityDistribution: [],
    eventTypes: [],
    recentActivity: [],
  });
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [patients, historyRecords] = await Promise.all([
        patientAPI.getAll(),
        historyAPI.getAll().then((res) => res.data || []),
      ]);
      setData(computeAnalytics(patients, historyRecords));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, loading, refresh };
};
