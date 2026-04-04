import { motion } from 'framer-motion';
import { FaTrashRestore, FaTrashAlt } from 'react-icons/fa';

const RecycleBin = () => {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold gradient-text">Recycle Bin</h1>
        <p className="text-white/60 mt-2">Restore or permanently delete archived records</p>
      </motion.div>
      
      <div className="glass-card p-6">
        <div className="text-center py-12">
          <FaTrashAlt className="text-5xl text-white/20 mx-auto mb-4" />
          <p className="text-white/40">No items in recycle bin</p>
          <p className="text-sm text-white/30 mt-2">Deleted patients appear here for 30 days</p>
        </div>
      </div>
    </div>
  );
};

export default RecycleBin;