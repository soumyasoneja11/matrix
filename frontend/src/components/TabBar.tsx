import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import {
  Home,
  HeartPulse,
  LayoutGrid,
  Users,
  UserCog,
  ClipboardList,
  BarChart3,
  Trash2,
} from 'lucide-react';
import { useAuth } from '../hooks/contexts/AuthContext';
import { Badge } from './ui/Badge';

export type TabId =
  | 'home'
  | 'patient-triage'
  | 'resource-allocation'
  | 'staff-directory'
  | 'staff-management'
  | 'my-worklist'
  | 'analytics'
  | 'recycle-bin';

interface Tab {
  id: TabId;
  label: string;
  icon: React.ReactNode;
  supervisorOnly?: boolean;
}

const tabs: Tab[] = [
  { id: 'home', label: 'Home', icon: <Home size={18} /> },
  { id: 'patient-triage', label: 'Patient Triage', icon: <HeartPulse size={18} /> },
  { id: 'resource-allocation', label: 'Resource Allocation', icon: <LayoutGrid size={18} />, supervisorOnly: true },
  { id: 'staff-directory', label: 'Staff Directory', icon: <Users size={18} />, supervisorOnly: true },
  { id: 'staff-management', label: 'Staff Management', icon: <UserCog size={18} />, supervisorOnly: true },
  { id: 'my-worklist', label: 'My Worklist', icon: <ClipboardList size={18} /> },
  { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={18} /> },
  { id: 'recycle-bin', label: 'Recycle Bin', icon: <Trash2 size={18} /> },
];

interface TabBarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  queueCounts?: { critical: number; urgent: number; standard: number };
}

export function TabBar({ activeTab, onTabChange, queueCounts = { critical: 0, urgent: 0, standard: 0 } }: TabBarProps) {
  const { isSupervisor } = useAuth();
  const visibleTabs = tabs.filter((t) => !t.supervisorOnly || isSupervisor);

  // Hide on home page
  if (activeTab === 'home') return null;

  return (
    <div className="bg-gradient-to-b from-white/90 to-white/60 backdrop-blur-md border-b border-forest-100/30 shadow-sm sticky top-[57px] z-40">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Flex with larger gaps, left alignment, and proper spacing */}
        <div className="flex flex-wrap items-center gap-2 py-3 overflow-x-auto scrollbar-hide">
          {visibleTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            // Determine which queue badge to show (only for triage tab?)
            let queueBadge = null;
            if (tab.id === 'patient-triage') {
              queueBadge = (
                <div className="flex items-center gap-1.5 ml-2">
                  <Badge variant="critical" size="sm" className="!px-1.5 !py-0.5 text-[10px] font-bold">
                    {queueCounts.critical}
                  </Badge>
                  <Badge variant="urgent" size="sm" className="!px-1.5 !py-0.5 text-[10px] font-bold">
                    {queueCounts.urgent}
                  </Badge>
                  <Badge variant="standard" size="sm" className="!px-1.5 !py-0.5 text-[10px] font-bold">
                    {queueCounts.standard}
                  </Badge>
                </div>
              );
            }

            return (
              <motion.button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                className={clsx(
                  'flex items-center gap-2.5 px-5 py-3 rounded-xl font-medium text-sm transition-all duration-200 whitespace-nowrap cursor-pointer shadow-sm',
                  isActive
                    ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-md shadow-primary-500/20'
                    : 'bg-white/60 text-forest-600 hover:bg-white/90 hover:text-forest-800 hover:shadow-md border border-white/40'
                )}
              >
                {tab.icon}
                <span className="tracking-wide">{tab.label}</span>
                {queueBadge}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}