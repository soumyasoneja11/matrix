import React from 'react';
import clsx from 'clsx';
import {
  HeartPulse,
  LayoutGrid,
  Users,
  UserCog,
  ClipboardList,
  BarChart3,
  Trash2,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export type TabId =
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
  { id: 'patient-triage', label: 'Patient Triage', icon: <HeartPulse size={16} /> },
  { id: 'resource-allocation', label: 'Resource Allocation', icon: <LayoutGrid size={16} />, supervisorOnly: true },
  { id: 'staff-directory', label: 'Staff Directory', icon: <Users size={16} />, supervisorOnly: true },
  { id: 'staff-management', label: 'Staff Management Directory', icon: <UserCog size={16} />, supervisorOnly: true },
  { id: 'my-worklist', label: 'My Worklist', icon: <ClipboardList size={16} /> },
  { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={16} /> },
  { id: 'recycle-bin', label: 'Recycle Bin', icon: <Trash2 size={16} /> },
];

interface TabBarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export function TabBar({ activeTab, onTabChange }: TabBarProps) {
  const { isSupervisor } = useAuth();

  const visibleTabs = tabs.filter((t) => !t.supervisorOnly || isSupervisor);

  return (
    <div className="px-6 pt-4 pb-0">
      <div className="flex gap-1 glass rounded-2xl p-1.5 overflow-x-auto">
        {visibleTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={clsx(
              'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300 cursor-pointer',
              activeTab === tab.id
                ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md'
                : 'text-gray-600 hover:bg-white/50 hover:text-primary-700'
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
