import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaComments, FaUsers, FaPlus, FaFire, FaPaperPlane, FaRobot } from 'react-icons/fa';
import { useChatAssistant, useChatHealth } from '../hooks/useApi';
import { useAuthContext as useAuth } from '../context/AuthContext';
import GlassCard from '../components/animations/GlassCard';
import TypingText from '../components/animations/TypingText';

const AIAssistantChat = () => {
  const { user } = useAuth();
  const { askAssistant, loading: assistantLoading } = useChatAssistant();
  const { data: healthData } = useChatHealth();
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: 'Hello! I\'m GitStake AI Assistant. I can help you with coding questions, analyze your GitHub activity, and provide insights about your development journey. How can I assist you today?',
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    try {
      const response = await askAssistant(inputMessage, {
        username: user?.username,
        context: 'general_chat'
      });

      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: response.message || 'I apologize, but I encountered an issue processing your request. Please try again.',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: 'I\'m currently experiencing some technical difficulties. Please try again in a moment.',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <GlassCard className="p-6 h-96 flex flex-col">
      <div className="flex items-center space-x-2 mb-4">
        <FaRobot className="text-blue-400" />
        <h3 className="text-xl font-semibold text-white">GitStake AI Assistant</h3>
        <div className={`w-2 h-2 rounded-full ${healthData?.status === 'healthy' ? 'bg-green-400' : 'bg-red-400'}`} />
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
              message.type === 'user'
                ? 'bg-blue-600 text-white'
                : 'bg-white/10 text-white border border-white/20'
            }`}>
              <p className="text-sm">{message.content}</p>
              <p className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </motion.div>
        ))}
        {assistantLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-white/10 text-white border border-white/20 px-4 py-2 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex space-x-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask me anything about coding or your GitHub activity..."
          className="flex-1 p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
          disabled={assistantLoading}
        />
        <motion.button
          onClick={handleSendMessage}
          disabled={assistantLoading || !inputMessage.trim()}
          className="px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaPaperPlane />
        </motion.button>
      </div>
    </GlassCard>
  );
};

const Chat = () => {
  const [rooms] = useState([
    { id: 1, name: 'General Discussion', members: 1247, active: true },
    { id: 2, name: 'Web3 Hackathon', members: 89, active: true },
    { id: 3, name: 'React Developers', members: 456, active: false },
    { id: 4, name: 'AI & ML Projects', members: 234, active: true },
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            <TypingText text="Community Chat" speed={80} />
          </h1>
          <p className="text-gray-400">Connect with developers worldwide</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* AI Assistant Chat */}
          <div>
            <AIAssistantChat />
          </div>

          {/* Community Features */}
          <div className="space-y-6">
            <GlassCard className="p-6">
              <h2 className="text-xl font-bold text-white mb-4">Hackathon Rooms</h2>
              <div className="space-y-3">
                {rooms.slice(0, 3).map((room, index) => (
                  <motion.div
                    key={room.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-3 bg-white/5 rounded-lg border border-white/10 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${room.active ? 'bg-green-400' : 'bg-gray-400'}`} />
                      <div>
                        <h4 className="text-white font-semibold text-sm">{room.name}</h4>
                        <p className="text-gray-400 text-xs">{room.members} members</p>
                      </div>
                    </div>
                    <motion.button
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Join
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Create Team</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Team name"
                  className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 text-sm"
                />
                <textarea
                  placeholder="Team description"
                  className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 h-16 resize-none text-sm"
                />
                <motion.button
                  className="w-full py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg font-semibold text-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaPlus className="inline mr-2" />
                  Create Team
                </motion.button>
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Karma Feed</h3>
              <div className="space-y-2">
                <div className="p-2 bg-white/5 rounded-lg">
                  <p className="text-white text-xs">🎉 Alice completed the React challenge!</p>
                  <p className="text-gray-400 text-xs mt-1">2 minutes ago</p>
                </div>
                <div className="p-2 bg-white/5 rounded-lg">
                  <p className="text-white text-xs">🔥 Bob achieved a 30-day streak!</p>
                  <p className="text-gray-400 text-xs mt-1">5 minutes ago</p>
                </div>
                <div className="p-2 bg-white/5 rounded-lg">
                  <p className="text-white text-xs">⭐ Charlie earned 100 AVAX rewards!</p>
                  <p className="text-gray-400 text-xs mt-1">10 minutes ago</p>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
