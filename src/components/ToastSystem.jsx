import React, { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, ExternalLink, Copy, X } from 'lucide-react';

// Toast Context
const ToastContext = createContext();

// Toast Provider Component
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (toast) => {
    const id = Date.now() + Math.random();
    const newToast = {
      id,
      timestamp: new Date(),
      ...toast,
    };
    setToasts(prev => [...prev, newToast]);
    
    // Auto remove after duration (default 5 seconds, 0 for persistent)
    if (toast.duration !== 0) {
      setTimeout(() => {
        removeToast(id);
      }, toast.duration || 5000);
    }
    
    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const clearAllToasts = () => {
    setToasts([]);
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast, clearAllToasts }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

// Hook to use toast
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Toast Container Component
const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed bottom-4 right-4 z-[9999] space-y-3 max-w-sm">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
};

// Individual Toast Component
const Toast = ({ toast, onRemove }) => {
  const [copied, setCopied] = useState(false);

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} className="text-green-400" />;
      case 'error':
        return <XCircle size={20} className="text-red-400" />;
      case 'warning':
        return <AlertCircle size={20} className="text-yellow-400" />;
      case 'info':
      default:
        return <Info size={20} className="text-blue-400" />;
    }
  };

  const getBackgroundColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-600/90 border-green-500';
      case 'error':
        return 'bg-red-600/90 border-red-500';
      case 'warning':
        return 'bg-yellow-600/90 border-yellow-500';
      case 'info':
      default:
        return 'bg-blue-600/90 border-blue-500';
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      transition={{ type: "spring", duration: 0.3 }}
      className={`${getBackgroundColor(toast.type)} border rounded-lg p-3 shadow-xl max-w-sm w-full`}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {getIcon(toast.type)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-white font-semibold text-sm font-['JetBrains_Mono']">
              {toast.title}
            </h4>
            <button
              onClick={onRemove}
              className="text-gray-300 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>
          
          {/* Transaction Hash Link - Simple and direct */}
          {toast.txHash && (
            <a
              href={`https://testnet.snowscan.xyz/tx/${toast.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-white hover:text-blue-300 transition-colors text-sm font-['JetBrains_Mono'] underline"
            >
              <span>View Transaction</span>
              <ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Utility functions for common toast types
export const toast = {
  success: (title, message, options = {}) => {
    const { addToast } = useToast();
    return addToast({ type: 'success', title, message, ...options });
  },
  
  error: (title, message, options = {}) => {
    const { addToast } = useToast();
    return addToast({ type: 'error', title, message, ...options });
  },
  
  warning: (title, message, options = {}) => {
    const { addToast } = useToast();
    return addToast({ type: 'warning', title, message, ...options });
  },
  
  info: (title, message, options = {}) => {
    const { addToast } = useToast();
    return addToast({ type: 'info', title, message, ...options });
  },
  
  // Special toast for staking success
  stakingSuccess: (txHash, challenge, stakeAmount, options = {}) => {
    const { addToast } = useToast();
    return addToast({
      type: 'success',
      title: 'Staking Successful! 🎉',
      message: `Successfully staked ${stakeAmount} AVAX for "${challenge.title}"`,
      txHash,
      duration: 0, // Don't auto-dismiss
      ...options
    });
  },
  
  // Special toast for staking error
  stakingError: (error, options = {}) => {
    const { addToast } = useToast();
    return addToast({
      type: 'error',
      title: 'Staking Failed',
      message: error.message || 'An error occurred while staking. Please try again.',
      duration: 8000, // Longer duration for errors
      ...options
    });
  }
};

export default ToastProvider;
