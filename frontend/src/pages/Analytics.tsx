import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Analytics = () => {
  const triageData = [
    { hour: '00:00', patients: 4, critical: 1 },
    { hour: '04:00', patients: 2, critical: 0 },
    { hour: '08:00', patients: 8, critical: 2 },
    { hour: '12:00', patients: 15, critical: 3 },
    { hour: '16:00', patients: 12, critical: 2 },
    { hour: '20:00', patients: 7, critical: 1 },
  ];

  const pieData = [
    { name: 'Critical', value: 15, color: '#ef4444' },
    { name: 'Urgent', value: 35, color: '#f59e0b' },
    { name: 'Standard', value: 50, color: '#10b981' },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold gradient-text">Live Analytics</h1>
        <p className="text-white/60 mt-2">Real-time metrics and insights</p>
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-6">
          <h2 className="text-lg font-bold mb-4">Patient Volume (Last 24h)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={triageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis dataKey="hour" stroke="#ffffff60" />
              <YAxis stroke="#ffffff60" />
              <Tooltip contentStyle={{ backgroundColor: '#1e1b4b', border: '1px solid #6366f1' }} />
              <Line type="monotone" dataKey="patients" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1' }} />
              <Line type="monotone" dataKey="critical" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444' }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="glass-card p-6">
          <h2 className="text-lg font-bold mb-4">Triage Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1e1b4b', border: '1px solid #6366f1' }} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;