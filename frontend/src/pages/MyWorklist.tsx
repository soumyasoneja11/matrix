import { motion } from 'framer-motion';
import { FaClipboardCheck, FaHourglassHalf, FaCheckCircle } from 'react-icons/fa';

const MyWorklist = () => {
  const tasks = [
    { task: 'Review triage for Room TR-1', priority: 'high', status: 'pending', icon: FaHourglassHalf },
    { task: 'Complete patient documentation', priority: 'medium', status: 'in-progress', icon: FaClipboardCheck },
    { task: 'Approve discharge for Room AC-1', priority: 'low', status: 'completed', icon: FaCheckCircle },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold gradient-text">My Worklist</h1>
        <p className="text-white/60 mt-2">Your assigned tasks and priorities</p>
      </motion.div>
      
      <div className="glass-card p-6">
        <div className="space-y-3">
          {tasks.map((task, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all"
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                task.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-green-500/20 text-green-400'
              }`}>
                <task.icon />
              </div>
              <div className="flex-1">
                <p className="font-medium">{task.task}</p>
                <p className="text-xs text-white/50 capitalize">{task.status}</p>
              </div>
              <button className="px-4 py-1.5 bg-primary-600/50 hover:bg-primary-600 rounded-lg text-sm transition-all">
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