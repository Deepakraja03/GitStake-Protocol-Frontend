import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const TypingText = ({ 
  text, 
  speed = 50, 
  className = '', 
  onComplete = () => {},
  startDelay = 0,
  cursor = true 
}) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, currentIndex === 0 ? startDelay : speed);

      return () => clearTimeout(timeout);
    } else if (!isComplete) {
      setIsComplete(true);
      onComplete();
    }
  }, [currentIndex, text, speed, startDelay, isComplete, onComplete]);

  return (
    <span className={className}>
      {displayText}
      {cursor && !isComplete && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
          className="inline-block"
        >
          |
        </motion.span>
      )}
    </span>
  );
};

export default TypingText;