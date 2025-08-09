import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaTimes, FaUser, FaCode, FaBook } from 'react-icons/fa';
import { githubAPI } from '../services';
import GlassCard from './animations/GlassCard';

const SearchModal = ({ isOpen, onClose }) => {
  const [searchType, setSearchType] = useState('users');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchTypes = [
    { id: 'users', label: 'Users', icon: FaUser },
    { id: 'repositories', label: 'Repositories', icon: FaBook },
    { id: 'code', label: 'Code', icon: FaCode },
  ];

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      let response;
      switch (searchType) {
        case 'users':
          response = await githubAPI.searchUsers(query);
          break;
        case 'repositories':
          response = await githubAPI.searchRepos(query);
          break;
        case 'code':
          response = await githubAPI.searchCode(query);
          break;
        default:
          throw new Error('Invalid search type');
      }
      
      setResults(response.data.items || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Search failed');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setResults([]);
      setError(null);
    }
  }, [isOpen]);

  const renderResult = (result, index) => {
    switch (searchType) {
      case 'users':
        return (
          <motion.div
            key={result.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <img 
                src={result.avatar_url} 
                alt={result.login}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h4 className="text-white font-semibold">{result.login}</h4>
                <p className="text-gray-400 text-sm">{result.type}</p>
              </div>
            </div>
          </motion.div>
        );
      
      case 'repositories':
        return (
          <motion.div
            key={result.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
          >
            <h4 className="text-white font-semibold">{result.full_name}</h4>
            <p className="text-gray-400 text-sm mb-2">{result.description}</p>
            <div className="flex items-center space-x-4 text-xs text-gray-400">
              <span>{result.language}</span>
              <span>⭐ {result.stargazers_count}</span>
              <span>🍴 {result.forks_count}</span>
            </div>
          </motion.div>
        );
      
      case 'code':
        return (
          <motion.div
            key={result.sha}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
          >
            <h4 className="text-white font-semibold">{result.name}</h4>
            <p className="text-gray-400 text-sm">{result.repository.full_name}</p>
            <p className="text-blue-400 text-xs mt-1">{result.path}</p>
          </motion.div>
        );
      
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="w-full max-w-2xl max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">GitHub Search</h2>
                <motion.button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-white"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaTimes />
                </motion.button>
              </div>

              {/* Search Type Tabs */}
              <div className="flex space-x-2 mb-4">
                {searchTypes.map((type) => (
                  <motion.button
                    key={type.id}
                    onClick={() => setSearchType(type.id)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2 ${
                      searchType === type.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <type.icon />
                    <span>{type.label}</span>
                  </motion.button>
                ))}
              </div>

              {/* Search Input */}
              <div className="flex space-x-2 mb-6">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={`Search ${searchType}...`}
                  className="flex-1 p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                />
                <motion.button
                  onClick={handleSearch}
                  disabled={loading || !query.trim()}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg flex items-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaSearch />
                  <span>{loading ? 'Searching...' : 'Search'}</span>
                </motion.button>
              </div>

              {/* Results */}
              <div className="max-h-96 overflow-y-auto">
                {error && (
                  <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-center">
                    {error}
                  </div>
                )}

                {loading && (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="p-4 bg-white/5 rounded-lg animate-pulse">
                        <div className="h-4 bg-white/10 rounded mb-2"></div>
                        <div className="h-3 bg-white/5 rounded w-2/3"></div>
                      </div>
                    ))}
                  </div>
                )}

                {!loading && !error && results.length === 0 && query && (
                  <div className="text-center text-gray-400 py-8">
                    No results found for "{query}"
                  </div>
                )}

                {!loading && !error && results.length > 0 && (
                  <div className="space-y-3">
                    {results.slice(0, 10).map((result, index) => renderResult(result, index))}
                  </div>
                )}
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;