import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Clock, Users, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { analyticsAPI } from '../services/api';
import type { Patient } from '../types/patient';

interface AnalyticsPageProps {
  patients: Patient[];
}

export function AnalyticsPage({ patients }: AnalyticsPageProps) {
  const totalPatients = patients.length;
  const criticalCount = patients.filter((p) => p.triageLevel === 'CRITICAL').length;
  const urgentCount = patients.filter((p) => p.triageLevel === 'URGENT').length;
  const standardCount = patients.filter((p) => p.triageLevel === 'STANDARD').length;

  const kpis = [
    { label: 'Total Patients', value: totalPatients, icon: <Users size={20} />, change: '+12%', positive: true, color: 'from-primary-500 to-primary-700' },
    { label: 'Critical Cases', value: criticalCount, icon: <Activity size={20} />, change: criticalCount > 0 ? 'Active' : 'None', positive: criticalCount === 0, color: 'from-red-500 to-red-600' },
    { label: 'Avg Triage Time', value: '2.4m', icon: <Clock size={20} />, change: '-18%', positive: true, color: 'from-blue-500 to-blue-600' },
    { label: 'Patient Flow', value: `${totalPatients}/hr`, icon: <TrendingUp size={20} />, change: '+5%', positive: true, color: 'from-amber-500 to-amber-600' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <BarChart3 size={24} className="text-primary-600" />
          Analytics Dashboard
        </h2>
        <p className="text-sm text-gray-500 mt-1">Real-time insights into ER operations and triage performance</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((kpi, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card hover>
              <div className="flex items-start justify-between mb-3">
                <div className={`w-11 h-11 rounded-2xl bg-linear-to-br ${kpi.color} flex items-center justify-center text-white shadow-lg`}>
                  {kpi.icon}
                </div>
                <span className={`flex items-center gap-0.5 text-xs font-medium ${kpi.positive ? 'text-green-600' : 'text-red-600'}`}>
                  {kpi.positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {kpi.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-800">{kpi.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{kpi.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Triage Distribution</h3>
          <div className="space-y-4">
            {[
              { label: 'Critical', count: criticalCount, total: totalPatients || 1, color: 'bg-red-500' },
              { label: 'Urgent', count: urgentCount, total: totalPatients || 1, color: 'bg-amber-500' },
              { label: 'Standard', count: standardCount, total: totalPatients || 1, color: 'bg-green-500' },
            ].map((bar) => (
              <div key={bar.label}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600 font-medium">{bar.label}</span>
                  <span className="text-gray-800 font-semibold">{bar.count}</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${(bar.count / bar.total) * 100}%` }} transition={{ duration: 0.8 }} className={`h-full rounded-full ${bar.color}`} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Patient Flow Trends</h3>
          <div className="flex items-end gap-2 h-48 pt-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${20 + Math.random() * 80}%` }} transition={{ duration: 0.5, delay: i * 0.05 }} className="flex-1 bg-linear-to-t from-primary-500 to-primary-300 rounded-t-lg" />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-gray-400">
            <span>12am</span><span>4am</span><span>8am</span><span>12pm</span><span>4pm</span><span>8pm</span>
          </div>
        </Card>
      </div>

      {/* Activity Log */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {patients.slice(0, 5).map((p, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-white/40 hover:bg-white/60 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600"><Activity size={14} /></div>
              <p className="text-sm text-gray-700 flex-1 truncate">
                Patient <span className="font-semibold">{p.name || 'Unknown'}</span> triaged as{' '}
                <Badge variant={p.triageLevel === 'CRITICAL' ? 'critical' : p.triageLevel === 'URGENT' ? 'urgent' : 'standard'}>{p.triageLevel}</Badge>
              </p>
            </div>
          ))}
          {patients.length === 0 && <p className="text-sm text-gray-400 text-center py-6">No recent activity</p>}
        </div>
      </Card>
    </div>
  );
}
