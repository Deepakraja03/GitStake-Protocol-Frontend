import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ 
  size = 'md', 
  color = 'blue', 
  text = '', 
  fullScreen = false,
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colorClasses = {
    blue: 'border-blue-500',
    purple: 'border-purple-500',
    green: 'border-green-500',
    red: 'border-red-500',
    yellow: 'border-yellow-500',
    white: 'border-white'
  };

  const spinnerElement = (
    <motion.div
      className={`${sizeClasses[size]} border-4 ${colorClasses[color]} border-t-transparent rounded-full ${className}`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="text-center">
          {spinnerElement}
          {text && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-white mt-4"
            >
              {text}
            </motion.p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center space-x-3">
      {spinnerElement}
      {text && <span className="text-gray-400">{text}</span>}
    </div>
  );
};

export const LoadingCard = ({ title = 'Loading...', className = '' }) => (
  <div className={`p-6 rounded-xl border border-white/10 bg-white/5 ${className}`}>
    <div className="animate-pulse space-y-4">
      <div className="h-6 bg-white/10 rounded w-1/3"></div>
      <div className="space-y-2">
        <div className="h-4 bg-white/5 rounded"></div>
        <div className="h-4 bg-white/5 rounded w-5/6"></div>
        <div className="h-4 bg-white/5 rounded w-4/6"></div>
      </div>
    </div>
  </div>
);

export const LoadingGrid = ({ count = 6, className = '' }) => (
  <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
    {Array.from({ length: count }).map((_, index) => (
      <LoadingCard key={index} />
    ))}
  </div>
);

export default LoadingSpinner;