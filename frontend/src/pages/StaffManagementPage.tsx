import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserCog, RefreshCw, Users } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { staffAPI } from '../services/api';
import type { StaffAssignment } from '../types/staff';

export function StaffManagementPage() {
  const [assignments, setAssignments] = useState<StaffAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const res = await staffAPI.getAssignments();
      setAssignments(res.data as StaffAssignment[]);
      setError('');
    } catch (err: any) {
      setError(err?.response?.status === 403 ? 'Server error: 403' : 'Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAssignments(); }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-primary-600 font-semibold uppercase tracking-wider mb-1">Operations View</p>
          <h2 className="text-2xl font-bold text-gray-800">Staff Management Directory</h2>
          <p className="text-sm text-gray-500 mt-1">Track which patients and tasks are assigned to doctors and nurses in real time.</p>
        </div>
        <Button variant="primary" onClick={fetchAssignments}>
          <RefreshCw size={14} /> Refresh
        </Button>
      </div>

      {error && (
        <Card className="!bg-red-50/60 border-red-200/60">
          <p className="text-sm text-red-600">{error}</p>
        </Card>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        </div>
      ) : assignments.length === 0 && !error ? (
        <EmptyState
          icon={<UserCog size={48} />}
          title="No assignments found"
          description="Staff assignments will appear here when patients are assigned."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {assignments.map((assign, i) => (
            <motion.div
              key={assign.staffId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card hover>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-xs">
                    {assign.staffName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800">{assign.staffName}</h4>
                    <Badge variant="info">{assign.role}</Badge>
                  </div>
                </div>

                {assign.assignedZone && (
                  <p className="text-xs text-gray-500 mb-2">
                    Zone: <span className="font-medium text-gray-700">{assign.assignedZone}</span>
                  </p>
                )}

                {assign.assignedPatients.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-600">Assigned Patients:</p>
                    {assign.assignedPatients.map((p) => (
                      <div key={p.id} className="flex items-center justify-between bg-white/50 rounded-xl px-3 py-2">
                        <span className="text-xs text-gray-700">{p.name}</span>
                        <Badge variant={p.triageLevel === 'CRITICAL' ? 'critical' : p.triageLevel === 'URGENT' ? 'urgent' : 'standard'} size="sm">
                          {p.triageLevel}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic">No patients assigned</p>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
