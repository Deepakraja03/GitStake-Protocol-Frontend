import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WagmiConfig } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { wagmiConfig, chains } from './config/wallet';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import RootLayout from './layouts/RootLayout';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Stake from './pages/Stake';
import Leaderboard from './pages/Leaderboard';
import DAO from './pages/DAO';
import Profile from './pages/Profile';
import Auth from './pages/Auth';
import Chat from './pages/Chat';
import Challenges from './pages/Challenges';
import Contributions from './pages/Contributions';
import Debug from './pages/Debug';

import '@rainbow-me/rainbowkit/styles.css';
import GitHubTest from './pages/GitHubTest';

const queryClient = new QueryClient();

const App = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <WagmiConfig config={wagmiConfig}>
          <RainbowKitProvider chains={chains}>
            <AuthProvider>
              <BrowserRouter>
                <Routes>
                  <Route element={<RootLayout />}> 
                    <Route index element={<Landing />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/stake" element={<Stake />} />
                    <Route path="/leaderboard" element={<Leaderboard />} />
                    {/* <Route path="/dao" element={<DAO />} /> */}
                    {/* <Route path="/chat" element={<Chat />} /> */}
                    <Route path="/challenges" element={<Challenges />} />
                    <Route path="/contributions" element={<Contributions />} />
                    <Route path="/profile" element={<Profile />} />
                    {/* <Route path="/debug" element={<Debug />} /> */}
                  </Route>
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/github-test" element={<GitHubTest />} />
                </Routes>
              </BrowserRouter>
            </AuthProvider>
          </RainbowKitProvider>
        </WagmiConfig>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;