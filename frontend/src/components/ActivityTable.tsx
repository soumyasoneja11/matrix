import React from 'react';
import { motion } from 'framer-motion';
import type { ActivityEntry } from '../hooks/useAnalyticsData';
import { useTheme } from '../hooks/contexts/ThemeContext';

interface ActivityTableProps {
  entries: ActivityEntry[];
}

const ActivityTable: React.FC<ActivityTableProps> = ({ entries }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="glass-card overflow-hidden"
    >
      <div className={`px-6 py-4 border-b ${isLight ? 'border-[#e8e2d9]' : 'border-white/10'}`}>
        <h2 className="text-lg font-bold theme-text">Recent Activity</h2>
        <p className="theme-text-subtle text-sm mt-0.5">Latest triage events and system actions</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={`border-b ${isLight ? 'border-[#e8e2d9]' : 'border-white/10'}`}>
              <th className={`text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider ${isLight ? 'text-[#6b7e7e]' : 'text-white/50'}`}>
                Event Type
              </th>
              <th className={`text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider ${isLight ? 'text-[#6b7e7e]' : 'text-white/50'}`}>
                Description
              </th>
              <th className={`text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider ${isLight ? 'text-[#6b7e7e]' : 'text-white/50'}`}>
                Actor
              </th>
              <th className={`text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider ${isLight ? 'text-[#6b7e7e]' : 'text-white/50'}`}>
                Timestamp
              </th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr
                key={entry.id}
                className={`border-b transition-colors duration-200 ${
                  isLight
                    ? 'border-[#f0ece4] hover:bg-[#f8f6f1]'
                    : 'border-white/5 hover:bg-white/5'
                }`}
              >
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-gradient-to-r ${entry.badgeClass} text-white shadow-lg`}
                  >
                    {entry.eventType}
                  </span>
                </td>
                <td className={`px-6 py-4 text-sm max-w-xs ${isLight ? 'text-[#3d5555]' : 'text-white/80'}`}>
                  {entry.description}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`text-sm font-medium ${
                      entry.actor === 'System'
                        ? isLight ? 'text-[#247B7B]' : 'text-primary-400'
                        : isLight ? 'text-[#3d5555]' : 'text-white/70'
                    }`}
                  >
                    {entry.actor}
                  </span>
                </td>
                <td className={`px-6 py-4 text-sm whitespace-nowrap ${isLight ? 'text-[#94a3a3]' : 'text-white/50'}`}>
                  {entry.timestamp}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default ActivityTable;
