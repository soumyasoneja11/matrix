import React from 'react';
import { motion } from 'framer-motion';
import type { ActivityEntry } from '../hooks/useAnalyticsData';

interface ActivityTableProps {
  entries: ActivityEntry[];
}

const ActivityTable: React.FC<ActivityTableProps> = ({ entries }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="glass-card overflow-hidden"
    >
      <div className="px-6 py-4 border-b border-white/10">
        <h2 className="text-lg font-bold">Recent Activity</h2>
        <p className="text-white/40 text-sm mt-0.5">Latest triage events and system actions</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left px-6 py-3 text-xs font-semibold text-white/50 uppercase tracking-wider">
                Event Type
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-white/50 uppercase tracking-wider">
                Description
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-white/50 uppercase tracking-wider">
                Actor
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-white/50 uppercase tracking-wider">
                Timestamp
              </th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, idx) => (
              <tr
                key={entry.id}
                className="border-b border-white/5 hover:bg-white/5 transition-colors duration-200"
              >
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-gradient-to-r ${entry.badgeClass} text-white shadow-lg`}
                  >
                    {entry.eventType}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-white/80 max-w-xs">
                  {entry.description}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`text-sm font-medium ${
                      entry.actor === 'System' ? 'text-primary-400' : 'text-white/70'
                    }`}
                  >
                    {entry.actor}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-white/50 whitespace-nowrap">
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
