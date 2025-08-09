import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaRobot, 
  FaTimes, 
  FaPaperPlane, 
  FaSearch, 
  FaMicrophone,
  FaSpinner,
  FaUser,
  FaCode,
  FaLightbulb
} from 'react-icons/fa';
import { chatService } from '../services/chatService';
import GlassCard from './animations/GlassCard';

const ZyraAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: "Hi! I'm Zyra, your AI assistant. I can help you with GitStake analytics, code questions, and development insights. How can I assist you today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDeepSearchMode, setIsDeepSearchMode] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      let response;
      
      if (isDeepSearchMode) {
        // Use deep search API
        response = await chatService.deepSearch.generalSearch({
          query: inputMessage,
          maxResults: 5,
          includeImages: false
        });
      } else {
        // Use regular chat assistant
        response = await chatService.assistant.askAssistant({
          message: inputMessage,
          context: {
            sessionId: 'zyra-session',
            platform: 'GitStake',
            timestamp: new Date().toISOString()
          }
        });
      }

      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: response.response || response.answer || 'I apologize, but I encountered an issue processing your request.',
        timestamp: new Date(),
        searchMode: isDeepSearchMode
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again later.',
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    {
      icon: FaCode,
      label: 'Code Review',
      action: () => setInputMessage('Can you help me review my code quality?')
    },
    {
      icon: FaLightbulb,
      label: 'Insights',
      action: () => setInputMessage('What insights can you provide about my GitHub activity?')
    },
    {
      icon: FaUser,
      label: 'Profile Tips',
      action: () => setInputMessage('How can I improve my developer profile?')
    }
  ];

  return (
    <>
      {/* Floating Assistant Button */}
      <motion.div
        className="fixed bottom-6 left-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 260, damping: 20 }}
      >
        <motion.button
          onClick={() => setIsOpen(true)}
          className="relative w-14 h-14 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaRobot className="text-white text-xl" />
          
          {/* Pulse animation */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 animate-ping opacity-20"></div>
          
          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            Ask Zyra
          </div>
        </motion.button>
      </motion.div>

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-start p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            {/* Chat Window */}
            <motion.div
              className="relative w-96 h-[600px] ml-20"
              initial={{ x: -100, opacity: 0, scale: 0.9 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={{ x: -100, opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <GlassCard className="h-full flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                      <FaRobot className="text-white text-lg" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Zyra</h3>
                      <p className="text-gray-400 text-sm">AI Assistant</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <FaTimes />
                  </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.type === 'user'
                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                            : message.isError
                            ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                            : 'bg-white/10 text-gray-200 border border-white/10'
                        }`}
                      >
                        {message.searchMode && (
                          <div className="flex items-center space-x-2 mb-2 text-blue-300">
                            <FaSearch className="text-xs" />
                            <span className="text-xs">Deep Search</span>
                          </div>
                        )}
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        <p className="text-xs opacity-60 mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                  
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="bg-white/10 text-gray-200 border border-white/10 p-3 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <FaSpinner className="animate-spin" />
                          <span className="text-sm">Zyra is thinking...</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Actions */}
                {messages.length === 1 && (
                  <div className="px-4 py-2">
                    <p className="text-gray-400 text-xs mb-2">Quick actions:</p>
                    <div className="flex space-x-2">
                      {quickActions.map((action, index) => (
                        <button
                          key={index}
                          onClick={action.action}
                          className="flex items-center space-x-1 px-2 py-1 bg-white/5 hover:bg-white/10 rounded-md text-xs text-gray-300 transition-colors"
                        >
                          <action.icon className="text-xs" />
                          <span>{action.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input */}
                <div className="p-4 border-t border-white/10">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 relative">
                      <textarea
                        ref={inputRef}
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={isDeepSearchMode ? "Search the web..." : "Ask Zyra anything..."}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-400 resize-none focus:outline-none focus:border-purple-500 transition-colors"
                        rows="1"
                        style={{ minHeight: '40px', maxHeight: '120px' }}
                      />
                    </div>
                    
                    <button
                      onClick={() => setIsDeepSearchMode(!isDeepSearchMode)}
                      className={`p-2 rounded-lg transition-colors ${
                        isDeepSearchMode
                          ? 'bg-blue-600 text-white'
                          : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                      }`}
                      title={isDeepSearchMode ? 'Switch to Chat Mode' : 'Switch to Deep Search'}
                    >
                      <FaSearch />
                    </button>
                    
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || isLoading}
                      className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <FaPaperPlane />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-gray-500">
                      {isDeepSearchMode ? 'Deep search mode active' : 'Chat with Zyra'}
                    </p>
                    <p className="text-xs text-gray-500">
                      Press Enter to send
                    </p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ZyraAssistant;