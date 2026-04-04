import { motion } from 'framer-motion';
import {
  FaUsers,
  FaSignInAlt,
  FaSignOutAlt,
  FaExchangeAlt,
  FaBirthdayCake,
  FaCalendarCheck,
  FaFileExport,
  FaSyncAlt,
} from 'react-icons/fa';
import AnalyticsCard from '../components/AnalyticsCard';
import ActivityTable from '../components/ActivityTable';
import { useAnalyticsData } from '../hooks/useAnalyticsData';
import { useCsvExport } from '../hooks/useCsvExport';

const Analytics = () => {
  const { data, loading, refresh } = useAnalyticsData();
  const { exportCsv } = useCsvExport();

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex items-start justify-between gap-4">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold gradient-text">Analytics Dashboard</h1>
          <p className="text-white/60 mt-2">Real-time metrics, insights & activity logs</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 flex-shrink-0"
        >
          <button
            onClick={() => exportCsv(data)}
            className="btn-secondary flex items-center gap-2 text-sm"
            id="export-csv-btn"
          >
            <FaFileExport className="text-primary-400" />
            Export CSV
          </button>
          <button
            onClick={refresh}
            disabled={loading}
            className="btn-primary flex items-center gap-2 text-sm"
            id="refresh-analytics-btn"
          >
            <FaSyncAlt className={`${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </motion.div>
      </div>

      {/* A. Top Summary Cards — 5 columns */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <AnalyticsCard
          icon={FaUsers}
          label="Total Patients"
          value={data.totalPatients}
          gradient="from-blue-500 to-cyan-500"
          delay={0}
        />
        <AnalyticsCard
          icon={FaSignInAlt}
          label="Today's Intake"
          value={data.todaysIntake}
          gradient="from-green-500 to-emerald-500"
          delay={0.05}
        />
        <AnalyticsCard
          icon={FaSignOutAlt}
          label="Discharges"
          value={data.discharges}
          gradient="from-purple-500 to-pink-500"
          delay={0.1}
        />
        <AnalyticsCard
          icon={FaExchangeAlt}
          label="Handoffs"
          value={data.handoffs}
          gradient="from-yellow-500 to-orange-500"
          delay={0.15}
        />
        <AnalyticsCard
          icon={FaBirthdayCake}
          label="Average Age"
          value={data.averageAge}
          gradient="from-indigo-500 to-purple-500"
          delay={0.2}
        />
      </div>

      {/* Total Events — accent card */}
      <AnalyticsCard
        icon={FaCalendarCheck}
        label="Total Events"
        value={data.totalEvents}
        gradient="from-primary-500 to-purple-600"
        delay={0.25}
        accent
      />

      {/* B. Charts Section — 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Priority Distribution */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <h2 className="text-lg font-bold mb-1">Priority Distribution</h2>
          <p className="text-white/40 text-sm mb-5">Triage severity breakdown</p>

          <div className="space-y-5">
            {data.priorityDistribution.map((item) => (
              <div key={item.key}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm font-semibold text-white/90">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-white">{item.count}</span>
                    <span className="text-xs text-white/50 w-10 text-right">
                      {item.percentage}%
                    </span>
                  </div>
                </div>
                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage}%` }}
                    transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Event Types */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35 }}
          className="glass-card p-6"
        >
          <h2 className="text-lg font-bold mb-1">Event Types</h2>
          <p className="text-white/40 text-sm mb-5">Activity breakdown by category</p>

          <div className="space-y-1">
            {data.eventTypes.map((evt, idx) => (
              <motion.div
                key={evt.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + idx * 0.05 }}
                className="flex items-center justify-between px-4 py-3.5 rounded-xl hover:bg-white/5 transition-colors duration-200"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{evt.icon}</span>
                  <span className="text-sm font-medium text-white/80">{evt.label}</span>
                </div>
                <span className="text-lg font-bold text-white tabular-nums">{evt.count}</span>
              </motion.div>
            ))}
          </div>

          {/* Divider + total */}
          <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between px-4">
            <span className="text-sm font-semibold text-white/60">Total</span>
            <span className="text-lg font-bold gradient-text tabular-nums">
              {data.eventTypes.reduce((sum, e) => sum + e.count, 0)}
            </span>
          </div>
        </motion.div>
      </div>

      {/* C. Recent Activity Table */}
      <ActivityTable entries={data.recentActivity} />
    </div>
  );
};

export default Analytics;