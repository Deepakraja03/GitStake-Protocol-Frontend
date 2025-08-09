import React from 'react';
import { motion } from 'framer-motion';
import { FaExclamationTriangle, FaSync } from 'react-icons/fa';
import GlassCard from './animations/GlassCard';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md"
          >
            <GlassCard className="p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <FaExclamationTriangle className="w-8 h-8 text-red-400" />
              </motion.div>
              
              <h2 className="text-2xl font-bold text-white mb-4">
                Oops! Something went wrong
              </h2>
              
              <p className="text-gray-400 mb-6">
                We encountered an unexpected error. Don't worry, our team has been notified.
              </p>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mb-6 text-left">
                  <summary className="text-red-400 cursor-pointer mb-2">
                    Error Details (Development)
                  </summary>
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-sm">
                    <p className="text-red-300 font-mono mb-2">
                      {this.state.error.toString()}
                    </p>
                    <pre className="text-red-200 text-xs overflow-auto">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </div>
                </details>
              )}
              
              <div className="space-y-3">
                <motion.button
                  onClick={() => window.location.reload()}
                  className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaSync />
                  <span>Reload Page</span>
                </motion.button>
                
                <motion.button
                  onClick={() => window.history.back()}
                  className="w-full py-3 px-6 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Go Back
                </motion.button>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;