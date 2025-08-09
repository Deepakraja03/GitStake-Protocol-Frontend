import React from 'react';
import { motion } from 'framer-motion';

const GlassCard = ({ 
  children, 
  className = '', 
  hover = true,
  glow = false,
  ...props 
}) => {
  const baseClasses = `
    backdrop-blur-md bg-white/10 border border-white/20 
    rounded-xl shadow-xl relative overflow-hidden
  `;

  const glowClasses = glow ? `
    before:absolute before:inset-0 before:rounded-xl
    before:bg-gradient-to-r before:from-blue-500/20 before:to-purple-500/20
    before:blur-xl before:-z-10
  ` : '';

  return (
    <motion.div
      className={`${baseClasses} ${glowClasses} ${className}`}
      whileHover={hover ? { 
        scale: 1.02, 
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' 
      } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;