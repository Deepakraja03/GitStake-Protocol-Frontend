import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const TypingText = ({
  text,
  speed = 50,
  className = '',
  onComplete = () => {},
  startDelay = 0,
  delay = 0,
  cursor = true
}) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!hasStarted && delay > 0) {
      const delayTimeout = setTimeout(() => {
        setHasStarted(true);
      }, delay);
      return () => clearTimeout(delayTimeout);
    } else if (!hasStarted) {
      setHasStarted(true);
    }
  }, [delay, hasStarted]);

  useEffect(() => {
    if (hasStarted && currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, currentIndex === 0 ? startDelay : speed);

      return () => clearTimeout(timeout);
    } else if (hasStarted && !isComplete && currentIndex >= text.length) {
      setIsComplete(true);
      onComplete();
    }
  }, [currentIndex, text, speed, startDelay, isComplete, onComplete, hasStarted]);

  return (
    <span className={className}>
      {displayText}
      {cursor && hasStarted && !isComplete && (
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