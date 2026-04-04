import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, RotateCcw, AlertTriangle, XCircle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { patientAPI } from '../services/api';
import type { Patient } from '../types/patient';

export function RecycleBinPage() {
  const [deleted, setDeleted] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDeleted = async () => {
    setLoading(true);
    try {
      const res = await patientAPI.getRecycleBin();
      setDeleted(res.data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchDeleted(); }, []);

  const handleRestore = async (id: number) => {
    try { await patientAPI.restore(id); fetchDeleted(); } catch {}
  };

  const handlePermanentDelete = async (id: number) => {
    try { await patientAPI.permanentDelete(id); fetchDeleted(); } catch {}
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Trash2 size={24} className="text-gray-400" />
          Recycle Bin
        </h2>
        <p className="text-sm text-gray-500 mt-1">Dismissed patient records can be recovered or permanently deleted</p>
      </div>

      <Card className="!bg-amber-50/40 border-amber-200/40">
        <div className="flex items-center gap-3">
          <AlertTriangle size={18} className="text-amber-600 shrink-0" />
          <p className="text-xs text-amber-700">Records in the recycle bin are held for 30 days before automatic permanent deletion.</p>
        </div>
      </Card>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        </div>
      ) : deleted.length === 0 ? (
        <EmptyState
          icon={<Trash2 size={48} />}
          title="Recycle bin is empty"
          description="Dismissed patient records will appear here for recovery."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {deleted.map((patient, i) => (
            <motion.div key={patient.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="opacity-75 hover:opacity-100 transition-opacity">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-semibold text-gray-700">{patient.name || 'Unknown'}</h4>
                  <Badge variant={patient.triageLevel === 'CRITICAL' ? 'critical' : patient.triageLevel === 'URGENT' ? 'urgent' : 'standard'}>
                    {patient.triageLevel}
                  </Badge>
                </div>
                {patient.chiefComplaint && <p className="text-xs text-gray-500 mb-3 line-clamp-2">{patient.chiefComplaint}</p>}
                <div className="flex gap-2 pt-2 border-t border-gray-100/60">
                  <Button variant="primary" size="sm" className="flex-1" onClick={() => handleRestore(patient.id)}>
                    <RotateCcw size={12} /> Restore
                  </Button>
                  <Button variant="danger" size="sm" className="flex-1" onClick={() => handlePermanentDelete(patient.id)}>
                    <XCircle size={12} /> Delete
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
