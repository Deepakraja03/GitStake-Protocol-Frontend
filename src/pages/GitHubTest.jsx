import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthContext } from '../context/AuthContext';
import GithubProvider from '../components/Github';
import GitHubProfile from '../components/GitHubProfile';

const GitHubTest = () => {
  const { user, isAuthenticated } = useAuthContext();
  const [testResults, setTestResults] = useState([]);

  const runTests = async () => {
    const results = [];
    
    // Test 1: Check if user is authenticated
    results.push({
      test: 'User Authentication',
      status: isAuthenticated ? 'PASS' : 'FAIL',
      message: isAuthenticated ? 'User is authenticated' : 'User is not authenticated'
    });

    // Test 2: Check if GitHub token exists
    results.push({
      test: 'GitHub Token',
      status: user?.githubAccessToken ? 'PASS' : 'FAIL',
      message: user?.githubAccessToken ? 'GitHub access token found' : 'No GitHub access token'
    });

    // Test 3: Test GitHub API call
    if (user?.githubAccessToken) {
      try {
        const response = await fetch('https://api.github.com/user', {
          headers: {
            'Authorization': `token ${user.githubAccessToken}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          results.push({
            test: 'GitHub API Call',
            status: 'PASS',
            message: `Successfully fetched data for ${data.login}`
          });
        } else {
          results.push({
            test: 'GitHub API Call',
            status: 'FAIL',
            message: `API call failed with status ${response.status}`
          });
        }
      } catch (error) {
        results.push({
          test: 'GitHub API Call',
          status: 'FAIL',
          message: `API call error: ${error.message}`
        });
      }
    } else {
      results.push({
        test: 'GitHub API Call',
        status: 'SKIP',
        message: 'Skipped - No access token available'
      });
    }

    setTestResults(results);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            GitHub Integration Test
          </h1>
          <p className="text-gray-300">
            Test your GitHub authentication and API integration
          </p>
        </motion.div>

        <div className="grid gap-6">
          {/* Authentication Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6"
          >
            <h2 className="text-2xl font-semibold text-white mb-4">Authentication</h2>
            
            {!isAuthenticated ? (
              <div className="text-center">
                <p className="text-gray-300 mb-4">Connect your GitHub account to get started</p>
                <GithubProvider 
                  onSuccess={(userData) => {
                    console.log('GitHub auth success:', userData);
                  }}
                  onError={(error) => {
                    console.error('GitHub auth error:', error);
                  }}
                />
              </div>
            ) : (
              <div className="text-center">
                <p className="text-green-400 mb-2">✅ Successfully authenticated!</p>
                <p className="text-gray-300">Welcome, {user?.displayName || user?.username}!</p>
                <GithubProvider className="mt-4" />
              </div>
            )}
          </motion.div>

          {/* Test Results Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-white">Integration Tests</h2>
              <button
                onClick={runTests}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Run Tests
              </button>
            </div>

            {testResults.length > 0 && (
              <div className="space-y-3">
                {testResults.map((result, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${
                      result.status === 'PASS' 
                        ? 'bg-green-900/20 border-green-500/30 text-green-300'
                        : result.status === 'FAIL'
                        ? 'bg-red-900/20 border-red-500/30 text-red-300'
                        : 'bg-yellow-900/20 border-yellow-500/30 text-yellow-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{result.test}</span>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        result.status === 'PASS' ? 'bg-green-600' :
                        result.status === 'FAIL' ? 'bg-red-600' : 'bg-yellow-600'
                      }`}>
                        {result.status}
                      </span>
                    </div>
                    <p className="text-sm mt-1 opacity-80">{result.message}</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* GitHub Profile Section */}
          {isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl font-semibold text-white mb-4">GitHub Profile</h2>
              <GitHubProfile />
            </motion.div>
          )}

          {/* Debug Information */}
          {isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6"
            >
              <h2 className="text-2xl font-semibold text-white mb-4">Debug Information</h2>
              <pre className="bg-black/30 p-4 rounded-lg text-sm text-gray-300 overflow-auto">
                {JSON.stringify({
                  user: {
                    uid: user?.uid,
                    email: user?.email,
                    displayName: user?.displayName,
                    username: user?.username,
                    hasGithubToken: !!user?.githubAccessToken
                  },
                  isAuthenticated,
                  localStorage: {
                    hasUserData: !!localStorage.getItem('userData'),
                    hasGithubToken: !!localStorage.getItem('githubAccessToken')
                  }
                }, null, 2)}
              </pre>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GitHubTest;
