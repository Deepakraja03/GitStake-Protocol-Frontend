import React from 'react';
import { motion } from 'framer-motion';
import APIStatus from '../components/APIStatus';
import TypingText from '../components/animations/TypingText';

const Debug = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            <TypingText text="API Integration Debug" speed={80} />
          </h1>
          <p className="text-gray-400">Backend endpoint integration status</p>
        </motion.div>

        <APIStatus />
      </div>
    </div>
  );
};

export default Debug;