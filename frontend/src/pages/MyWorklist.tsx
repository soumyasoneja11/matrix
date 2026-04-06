import { motion } from 'framer-motion';
import { FaClipboardCheck, FaHourglassHalf, FaCheckCircle } from 'react-icons/fa';
import { useTheme } from '../hooks/contexts/ThemeContext';

const MyWorklist = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const tasks = [
    { task: 'Review triage for Room TR-1', priority: 'high', status: 'pending', icon: FaHourglassHalf },
    { task: 'Complete patient documentation', priority: 'medium', status: 'in-progress', icon: FaClipboardCheck },
    { task: 'Approve discharge for Room AC-1', priority: 'low', status: 'completed', icon: FaCheckCircle },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className={`text-3xl font-bold ${isLight ? 'text-[#1a2e2e]' : 'gradient-text'}`}>My Worklist</h1>
        <p className="theme-text-muted mt-2">Your assigned tasks and priorities</p>
      </motion.div>
      
      <div className="glass-card p-6">
        <div className="space-y-3">
          {tasks.map((task, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                isLight
                  ? 'bg-[#f8f6f1] hover:bg-[#f0ece4]'
                  : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                task.priority === 'high' ? (isLight ? 'bg-red-50 text-red-500' : 'bg-red-500/20 text-red-400') :
                task.priority === 'medium' ? (isLight ? 'bg-yellow-50 text-yellow-600' : 'bg-yellow-500/20 text-yellow-400') :
                (isLight ? 'bg-green-50 text-green-500' : 'bg-green-500/20 text-green-400')
              }`}>
                <task.icon />
              </div>
              <div className="flex-1">
                <p className="font-medium theme-text">{task.task}</p>
                <p className="text-xs theme-text-muted capitalize">{task.status}</p>
              </div>
              <button className={`px-4 py-1.5 rounded-lg text-sm transition-all ${
                isLight
                  ? 'bg-[#e8f5f5] text-[#247B7B] hover:bg-[#247B7B] hover:text-white'
                  : 'bg-primary-600/50 hover:bg-primary-600 text-white'
              }`}>
                Update
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyWorklist;