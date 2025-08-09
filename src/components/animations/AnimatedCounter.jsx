import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

const AnimatedCounter = ({ 
  value, 
  duration = 2, 
  className = '',
  prefix = '',
  suffix = '',
  decimals = 0 
}) => {
  const spring = useSpring(0, { duration: duration * 1000 });
  const display = useTransform(spring, (current) => 
    `${prefix}${current.toFixed(decimals)}${suffix}`
  );

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return (
    <motion.span className={className}>
      {display}
    </motion.span>
  );
};

export default AnimatedCounter;