import { motion } from 'framer-motion';
import { FaUserMd, FaStethoscope, FaUserNurse, FaPhone, FaEnvelope } from 'react-icons/fa';
import { useTheme } from '../hooks/contexts/ThemeContext';
import { useState } from 'react';

const StaffDirectory = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const staff = [
    { name: 'Dr. Sarah Chen', role: 'Emergency Physician', department: 'ER', status: 'online', icon: FaUserMd, color: 'from-blue-500 to-cyan-500', phone: '+1-555-0101', email: 'sarah.chen@hospital.com' },
    { name: 'Dr. James Wilson', role: 'Trauma Surgeon', department: 'Surgery', status: 'busy', icon: FaStethoscope, color: 'from-purple-500 to-pink-500', phone: '+1-555-0102', email: 'james.wilson@hospital.com' },
    { name: 'Nurse Emily Rodriguez', role: 'Head Nurse', department: 'ER', status: 'online', icon: FaUserNurse, color: 'from-green-500 to-emerald-500', phone: '+1-555-0103', email: 'emily.rodriguez@hospital.com' },
  ];

  const [callUser, setCallUser] = useState<typeof staff[0] | null>(null);
  const [messageUser, setMessageUser] = useState<typeof staff[0] | null>(null);
  const [messageText, setMessageText] = useState('');

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className={`text-3xl font-bold ${isLight ? 'text-[#1a2e2e]' : 'gradient-text'}`}>
          Staff Directory
        </h1>
        <p className="theme-text-muted mt-2">Connect with your team members</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {staff.map((member, idx) => (
          <motion.div
            key={member.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ y: -4 }}
            className="glass-card p-6"
          >
            <div className="flex items-start gap-4">
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${member.color} flex items-center justify-center`}>
                <member.icon className="text-white text-2xl" />
              </div>

              <div className="flex-1">
                <h3 className="font-bold theme-text">{member.name}</h3>
                <p className={`text-sm ${isLight ? 'text-[#247B7B]' : 'text-primary-300'}`}>
                  {member.role}
                </p>
                <p className="text-xs theme-text-muted">{member.department}</p>

                <div className="flex gap-2 mt-3">
                  {/* Call Button */}
                  <button
                    onClick={() => setCallUser(member)}
                    className={`
                      inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                      cursor-pointer transition-all duration-200
                      ${isLight
                        ? 'text-[#247B7B] bg-[#247B7B]/8 hover:bg-[#247B7B]/20'
                        : 'text-primary-300 bg-primary-400/10 hover:bg-primary-400/25'
                      }
                    `}
                  >
                    <FaPhone size={12} />
                    Call
                  </button>

                  {/* Message Button */}
                  <button
                    onClick={() => setMessageUser(member)}
                    className={`
                      inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                      cursor-pointer transition-all duration-200
                      ${isLight
                        ? 'text-[#247B7B] bg-[#247B7B]/8 hover:bg-[#247B7B]/20'
                        : 'text-primary-300 bg-primary-400/10 hover:bg-primary-400/25'
                      }
                    `}
                  >
                    <FaEnvelope size={12} />
                    Message
                  </button>
                </div>
              </div>

              <div className={`w-2 h-2 rounded-full ${member.status === 'online' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* CALL MODAL */}
      {callUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="glass-card p-6 w-80 rounded-xl text-center">
            <h2 className="text-lg font-bold mb-2">Call {callUser.name}</h2>
            <p className="theme-text-muted mb-4">
              {callUser.phone || 'No number available'}
            </p>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => {
                  alert(`Calling ${callUser.name}...`);
                  setCallUser(null);
                }}
                className="px-4 py-2 bg-green-500 text-white rounded-lg"
              >
                Call
              </button>

              <button
                onClick={() => setCallUser(null)}
                className="px-4 py-2 bg-gray-400 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MESSAGE MODAL */}
      {messageUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="glass-card p-6 w-96 rounded-xl">
            <h2 className="text-lg font-bold mb-3">
              Message {messageUser.name}
            </h2>

            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type your message..."
              className="w-full p-2 rounded-lg border outline-none mb-4 bg-transparent"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  alert(`Message sent to ${messageUser.name}: ${messageText}`);
                  setMessageText('');
                  setMessageUser(null);
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
              >
                Send
              </button>

              <button
                onClick={() => setMessageUser(null)}
                className="px-4 py-2 bg-gray-400 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffDirectory;