import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { wagmiConfig } from './config/wallet';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import RootLayout from './layouts/RootLayout';
import { FullyProtectedRoute, WalletProtectedRoute, GitHubProtectedRoute } from './components/ProtectedRoute';
import AuthFlow from './components/AuthFlow';
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
import Quests from './pages/Quests';
import Debug from './pages/Debug';
import TestIntegration from './pages/TestIntegration';
import ZyraAssistant from './components/ZyraAssistant';

import '@rainbow-me/rainbowkit/styles.css';
import GitHubTest from './pages/GitHubTest';
import AuthTest from './pages/AuthTest';
import AuthStateTest from './pages/AuthStateTest';

const queryClient = new QueryClient();

const App = () => {
  return (
    <ErrorBoundary>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            <AuthProvider>
              <BrowserRouter>
                <Routes>
                  <Route element={<RootLayout />}>
                    {/* Public routes */}
                    <Route index element={<Landing />} />

                    {/* Routes requiring both wallet and GitHub */}
                    <Route path="/dashboard" element={
                      <FullyProtectedRoute>
                        <Dashboard />
                      </FullyProtectedRoute>
                    } />
                    <Route path="/profile" element={
                      <FullyProtectedRoute>
                        <Profile />
                      </FullyProtectedRoute>
                    } />
                    <Route path="/contributions" element={
                      <FullyProtectedRoute>
                        <Contributions />
                      </FullyProtectedRoute>
                    } />
                    <Route path="/leaderboard" element={
                      <FullyProtectedRoute>
                        <Leaderboard />
                      </FullyProtectedRoute>
                    } />

                    {/* Routes requiring wallet connection */}
                    <Route path="/stake" element={
                      <WalletProtectedRoute>
                        <Stake />
                      </WalletProtectedRoute>
                    } />
                    <Route path="/quests" element={
                      <WalletProtectedRoute>
                        <Quests />
                      </WalletProtectedRoute>
                    } />

                    {/* Routes requiring GitHub authentication */}
                    <Route path="/challenges" element={
                      <GitHubProtectedRoute>
                        <Challenges />
                      </GitHubProtectedRoute>
                    } />

                    {/* Debug/Test routes */}
                    <Route path="/debug" element={<Debug />} />
                    <Route path="/test" element={<TestIntegration />} />
                    <Route path="/auth-state-test" element={<AuthStateTest />} />
                  </Route>

                </Routes>
                <ZyraAssistant />
              </BrowserRouter>
            </AuthProvider>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ErrorBoundary>
  );
};

export default App;
