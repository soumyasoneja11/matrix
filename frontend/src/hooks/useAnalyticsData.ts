import { useState, useCallback } from 'react';
import { DEMO_PATIENTS, DEMO_ZONES, DEMO_ROOMS } from '../utils/mockData';

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

const generateTimestamp = (minutesAgo: number): string => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - minutesAgo);
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const computeAnalytics = (): AnalyticsSummary => {
  const patients = DEMO_PATIENTS;
  const totalPatients = patients.length;

  const criticalCount = patients.filter(p => p.triageLevel === 'CRITICAL').length;
  const urgentCount = patients.filter(p => p.triageLevel === 'URGENT').length;
  const standardCount = patients.filter(p => p.triageLevel === 'STANDARD').length;

  const ages = patients.map(p => p.age ?? 0).filter(a => a > 0);
  const averageAge = ages.length > 0 ? Math.round(ages.reduce((s, a) => s + a, 0) / ages.length) : 0;

  const todaysIntake = 7;
  const discharges = 3;
  const handoffs = 4;

  const totalEvents = todaysIntake + discharges + handoffs + 5;

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
    { label: 'Resource Allocation', count: 8, icon: '🏗️' },
    { label: 'Intake', count: todaysIntake, icon: '📋' },
    { label: 'Reassessment', count: 5, icon: '🔄' },
    { label: 'Priority Change', count: 3, icon: '⚡' },
  ];

  const recentActivity: ActivityEntry[] = [
    {
      id: 1,
      eventType: 'Resource Allocation',
      badgeClass: 'from-blue-500 to-cyan-500',
      description: 'ICU Bed TR-1 assigned to Rahul Sharma',
      actor: 'System',
      timestamp: generateTimestamp(5),
    },
    {
      id: 2,
      eventType: 'Intake',
      badgeClass: 'from-green-500 to-emerald-500',
      description: 'New patient Priya Patel registered — CRITICAL triage',
      actor: 'Staff',
      timestamp: generateTimestamp(12),
    },
    {
      id: 3,
      eventType: 'Priority Change',
      badgeClass: 'from-amber-500 to-orange-500',
      description: 'Vikram Singh priority escalated STANDARD → URGENT',
      actor: 'Dr. Advik Mehta',
      timestamp: generateTimestamp(28),
    },
    {
      id: 4,
      eventType: 'Resource Allocation',
      badgeClass: 'from-blue-500 to-cyan-500',
      description: 'Ventilator assigned to Resuscitation Bay TR-3',
      actor: 'System',
      timestamp: generateTimestamp(35),
    },
    {
      id: 5,
      eventType: 'Intake',
      badgeClass: 'from-green-500 to-emerald-500',
      description: 'New patient Amit Kumar registered — CRITICAL triage',
      actor: 'Staff',
      timestamp: generateTimestamp(42),
    },
    {
      id: 6,
      eventType: 'Priority Change',
      badgeClass: 'from-amber-500 to-orange-500',
      description: 'Meera Joshi priority changed STANDARD → URGENT',
      actor: 'Dr. Rudra Joshi',
      timestamp: generateTimestamp(55),
    },
  ];

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
  const [data, setData] = useState<AnalyticsSummary>(computeAnalytics);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(() => {
    setLoading(true);
    // Simulate a short delay for UX feedback
    setTimeout(() => {
      setData(computeAnalytics());
      setLoading(false);
    }, 500);
  }, []);

  return { data, loading, refresh };
};
