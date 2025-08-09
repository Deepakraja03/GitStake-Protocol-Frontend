import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaStar, FaCodeBranch, FaUsers, FaBook } from 'react-icons/fa';
import { useAuthContext } from '../context/AuthContext';

const GitHubProfile = () => {
  const { user } = useAuthContext();
  const [githubData, setGithubData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.githubAccessToken && user?.username) {
      fetchGitHubData();
    }
  }, [user]);

  const fetchGitHubData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch user profile data from GitHub API
      const response = await fetch(`https://api.github.com/user`, {
        headers: {
          'Authorization': `token ${user.githubAccessToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch GitHub data');
      }

      const data = await response.json();
      setGithubData(data);
    } catch (err) {
      setError(err.message);
      console.error('GitHub API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRepos = async () => {
    if (!user?.githubAccessToken) return [];
    
    try {
      const response = await fetch(`https://api.github.com/user/repos?sort=updated&per_page=10`, {
        headers: {
          'Authorization': `token ${user.githubAccessToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch repositories');
      }

      return await response.json();
    } catch (err) {
      console.error('Error fetching repos:', err);
      return [];
    }
  };

  if (!user?.githubAccessToken) {
    return (
      <div className="text-center p-6">
        <FaGithub className="mx-auto text-4xl text-gray-400 mb-4" />
        <p className="text-gray-400">Connect your GitHub account to see your profile</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        <span className="ml-2 text-gray-300">Loading GitHub data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6">
        <p className="text-red-400 mb-4">Error: {error}</p>
        <button 
          onClick={fetchGitHubData}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!githubData) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6"
    >
      <div className="flex items-center gap-4 mb-6">
        <img 
          src={githubData.avatar_url} 
          alt={githubData.name || githubData.login}
          className="w-16 h-16 rounded-full border-2 border-white/20"
        />
        <div>
          <h3 className="text-xl font-semibold text-white">
            {githubData.name || githubData.login}
          </h3>
          <p className="text-gray-400">@{githubData.login}</p>
          {githubData.bio && (
            <p className="text-gray-300 text-sm mt-1">{githubData.bio}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <FaBook className="text-blue-400 mr-1" />
            <span className="text-2xl font-bold text-white">{githubData.public_repos}</span>
          </div>
          <p className="text-gray-400 text-sm">Repositories</p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <FaUsers className="text-green-400 mr-1" />
            <span className="text-2xl font-bold text-white">{githubData.followers}</span>
          </div>
          <p className="text-gray-400 text-sm">Followers</p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <FaUsers className="text-purple-400 mr-1" />
            <span className="text-2xl font-bold text-white">{githubData.following}</span>
          </div>
          <p className="text-gray-400 text-sm">Following</p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <FaGithub className="text-gray-400 mr-1" />
            <span className="text-2xl font-bold text-white">{githubData.public_gists}</span>
          </div>
          <p className="text-gray-400 text-sm">Gists</p>
        </div>
      </div>

      {githubData.company && (
        <div className="mb-4">
          <p className="text-gray-300">
            <span className="text-gray-400">Company:</span> {githubData.company}
          </p>
        </div>
      )}

      {githubData.location && (
        <div className="mb-4">
          <p className="text-gray-300">
            <span className="text-gray-400">Location:</span> {githubData.location}
          </p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-gray-400 text-sm">
          Joined {new Date(githubData.created_at).toLocaleDateString()}
        </p>
        <a
          href={githubData.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
        >
          <FaGithub />
          View Profile
        </a>
      </div>
    </motion.div>
  );
};

export default GitHubProfile;
