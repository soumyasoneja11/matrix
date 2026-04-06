import { useEffect, useState, useRef, useCallback } from 'react';


import PatientTriageForm from '../components/PatientTriageForm';
import TriageBoard from '../components/TriageBoard';
import { fetchPatients } from '../services/api';
import { Patient, TriageLevel } from '../types';
import { Activity } from 'lucide-react';
import { useTheme } from '../hooks/contexts/ThemeContext';
import { useAuth } from '../hooks/contexts/AuthContext';

const DEMO_PATIENTS: Patient[] = [
  {
    id: "9001",
    name: 'Maria Gonzalez',
    age: 58,
    description: 'Severe chest pain radiating to left arm, shortness of breath, diaphoresis. History of hypertension. BP 180/110, HR 112, SpO2 91%.',
    triageLevel: TriageLevel.CRITICAL,
    assignedStaff: 'Dr. Sarah Chen',
    location: 'Trauma Bay 1',
    vitals: { heartRate: 112, bloodPressure: '180/110', temperature: 37.2, oxygenSaturation: 91 },
    createdAt: new Date(Date.now() - 12 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60000).toISOString(),
  },
  {
    id: "9002",
    name: 'Robert Kim',
    age: 34,
    description: 'Fall from ladder, suspected right tibial fracture. Moderate pain 7/10, swelling at mid-shaft. Neurovascularly intact distally.',
    triageLevel: TriageLevel.URGENT,
    assignedStaff: 'Dr. James Wilson',
    location: 'Room AC-3',
    vitals: { heartRate: 88, bloodPressure: '135/85', temperature: 36.8, oxygenSaturation: 98 },
    createdAt: new Date(Date.now() - 45 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 20 * 60000).toISOString(),
  },
  {
    id: "9003",
    name: 'Emily Patel',
    age: 22,
    description: 'Sore throat for 3 days, mild fever, no difficulty swallowing or breathing. No known allergies. Vitals stable.',
    triageLevel: TriageLevel.STANDARD,
    assignedStaff: 'Nurse Rodriguez',
    location: 'Waiting Area B',
    vitals: { heartRate: 72, bloodPressure: '118/75', temperature: 37.8, oxygenSaturation: 99 },
    createdAt: new Date(Date.now() - 90 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 60 * 60000).toISOString(),
  },
];

const Dashboard = () => {
  const [patients, setPatients] = useState<Patient[]>(DEMO_PATIENTS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const { theme } = useTheme();
  const { isDemo } = useAuth();
  const isLight = theme === 'light';

  const TRIAGE_SORT_WEIGHT: Record<TriageLevel, number> = {
    [TriageLevel.CRITICAL]: 0,
    [TriageLevel.URGENT]: 1,
    [TriageLevel.STANDARD]: 2,
  };

  const parseTime = (value?: string): number => {
    if (!value) return 0;
    const ts = Date.parse(value);
    return Number.isNaN(ts) ? 0 : ts;
  };

  const sortForBoard = (items: Patient[]): Patient[] => {
    return [...items].sort((a, b) => {
      const triageDelta = TRIAGE_SORT_WEIGHT[a.triageLevel] - TRIAGE_SORT_WEIGHT[b.triageLevel];
      if (triageDelta !== 0) return triageDelta;

      const timeA = parseTime(a.createdAt) || parseTime(a.updatedAt);
      const timeB = parseTime(b.createdAt) || parseTime(b.updatedAt);
      if (timeA !== timeB) return timeB - timeA;

      return (a.name || '').localeCompare(b.name || '');
    });
  };

  // pauseRefresh is a ref so setInterval always sees the live value
  // (no stale closure), and writing to it doesn't re-render Dashboard.
  const pauseRefreshRef = useRef(false);

  const loadPatients = useCallback(async () => {
    if (pauseRefreshRef.current) return;

    if (isDemo) {
      setPatients(sortForBoard(DEMO_PATIENTS));
      setLastUpdate(new Date());
      setError(null);
      setLoading(false);
      return;
    }

    try {
      const data = await fetchPatients();
      setPatients(data.length > 0 ? data : sortForBoard(DEMO_PATIENTS));
      setLastUpdate(new Date());
      setError(null);
    } catch (err: any) {
      console.error('Failed to load patients:', err);

      if (err?.status === 401 || err?.status === 403) {
        setError('Session is not authorized to read patient list. Please sign in again (avoid Demo mode for live backend data).');
        pauseRefreshRef.current = true;
      }

      setPatients(prev => prev.length === 0 ? sortForBoard(DEMO_PATIENTS) : prev);
    } finally {
      setLoading(false);
    }
  }, [isDemo]);

  // Single stable interval — the ref check inside loadPatients handles pausing.
  useEffect(() => {
    if (isDemo) {
      loadPatients();
      return;
    }

    loadPatients();
    const interval = setInterval(loadPatients, 4000);
    return () => clearInterval(interval);
  }, [loadPatients, isDemo]);

  // This is what TriageBoard calls — writes to ref, no re-render
  const setPauseRefresh = (pause: boolean) => {
    pauseRefreshRef.current = pause;
  };

  const handlePatientAdded = (newPatient?: Patient) => {
    if (newPatient) {
      setPatients(prev => {
        const withoutDuplicate = prev.filter(p => p.id !== newPatient.id);
        return sortForBoard([newPatient, ...withoutDuplicate]);
      });
      setLastUpdate(new Date());
      return;
    }

    loadPatients();
  };


  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <PatientTriageForm onPatientAdded={handlePatientAdded} />
        </div>
        <div className="lg:col-span-2">
          {error ? (
            <div className="glass-card p-12 text-center border-red-500/20">
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Sync Error</h3>
              <p className="text-white/60 mb-6">{error}</p>
              <button
                onClick={loadPatients}
                className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all"
              >
                Retry Connection
              </button>
            </div>
          ) : loading ? (
            <div className="glass-card p-12 text-center">
              <div className={`animate-spin w-8 h-8 border-4 border-t-transparent rounded-full mx-auto mb-4 ${
                isLight ? 'border-[#247B7B]' : 'border-primary-500'
              }`} />
              <p className="theme-text-muted">Loading triage dashboard...</p>
            </div>
          ) : (
            <TriageBoard
              patients={patients}
              onPatientUpdate={loadPatients}
              setPauseRefresh={setPauseRefresh}
            />
          )}
        </div>
      </div>

      <div className={`text-center text-xs pt-4 ${isLight ? 'text-[#b0bfbf]' : 'text-white/30'}`}>
        Last updated: {lastUpdate.toLocaleTimeString()} · Live data feed active
      </div>
    </div>
  );
};

export default Dashboard;