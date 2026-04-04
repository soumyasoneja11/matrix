import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, ShieldAlert } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { useAuth } from '../contexts/AuthContext';
import { worklistAPI } from '../services/api';
import type { Patient } from '../types/patient';

export function MyWorklistPage() {
  const { user } = useAuth();
  const [worklist, setWorklist] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await worklistAPI.getMyWorklist();
        setWorklist(res.data);
        setError('');
      } catch (err: any) {
        if (err?.response?.status === 403) {
          setError('You do not have permission to view this worklist.');
        } else {
          setError('Unable to load worklist.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const isAllowed = user?.role === 'DOCTOR' || user?.role === 'NURSE';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <ClipboardList size={24} className="text-primary-600" />
          My Worklist
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {user?.role === 'DOCTOR' ? 'Patients assigned to you for treatment' :
           user?.role === 'NURSE' ? 'Patients under your care' :
           'Your assigned tasks and responsibilities'}
        </p>
      </div>

      {!isAllowed ? (
        <Card className="bg-amber-50/60!">
          <EmptyState
            icon={<ShieldAlert size={48} />}
            title="Role-based access"
            description="Worklist is available for Doctors and Nurses. Your current role doesn't have assigned patients."
          />
        </Card>
      ) : loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        </div>
      ) : error ? (
        <Card className="bg-red-50/60!">
          <p className="text-sm text-red-600">{error}</p>
        </Card>
      ) : worklist.length === 0 ? (
        <EmptyState
          icon={<ClipboardList size={48} />}
          title="No patients in your worklist"
          description="New patients will appear here when they're assigned to you."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {worklist.map((patient, i) => (
            <motion.div
              key={patient.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card hover>
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-semibold text-gray-800">{patient.name || 'Unknown'}</h4>
                  <Badge variant={patient.triageLevel === 'CRITICAL' ? 'critical' : patient.triageLevel === 'URGENT' ? 'urgent' : 'standard'}>
                    {patient.triageLevel}
                  </Badge>
                </div>
                {patient.age && <p className="text-xs text-gray-500">Age: {patient.age}</p>}
                {patient.chiefComplaint && (
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">{patient.chiefComplaint}</p>
                )}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {patient.zoneName && <Badge variant="info">{patient.zoneName}</Badge>}
                  {patient.roomCode && <Badge variant="default">{patient.roomCode}</Badge>}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
