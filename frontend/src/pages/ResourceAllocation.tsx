import { motion } from 'framer-motion';
import { FaBed, FaLungs, FaSyringe, FaAmbulance } from 'react-icons/fa';

const ResourceAllocation = () => {
  const resources = [
    { icon: FaBed, name: 'ICU Beds', available: 8, total: 15, color: 'from-red-500 to-pink-500' },
    { icon: FaLungs, name: 'Ventilators', available: 12, total: 20, color: 'from-blue-500 to-cyan-500' },
    { icon: FaSyringe, name: 'Emergency Kits', available: 45, total: 50, color: 'from-green-500 to-emerald-500' },
    { icon: FaAmbulance, name: 'Ambulances', available: 3, total: 5, color: 'from-yellow-500 to-orange-500' },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold gradient-text">Resource Allocation</h1>
        <p className="text-white/60 mt-2">Real-time resource tracking and allocation</p>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {resources.map((resource, idx) => (
          <motion.div
            key={resource.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card p-6 hover-lift"
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${resource.color} flex items-center justify-center mb-4`}>
              <resource.icon className="text-white text-xl" />
            </div>
            <h3 className="font-bold text-lg">{resource.name}</h3>
            <div className="mt-3">
              <div className="flex justify-between text-sm mb-1">
                <span>Available</span>
                <span className="font-bold">{resource.available} / {resource.total}</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${resource.color} rounded-full transition-all duration-500`}
                  style={{ width: `${(resource.available / resource.total) * 100}%` }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ResourceAllocation;