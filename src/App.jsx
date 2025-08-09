import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import RootLayout from './layouts/RootLayout'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Stake from './pages/Stake'
import Leaderboard from './pages/Leaderboard'
import DAO from './pages/DAO'
import Profile from './pages/Profile'
import Auth from './pages/Auth'
import Chat from './pages/Chat'
import Challenges from './pages/Challenges'
import Contributions from './pages/Contributions'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}> 
          <Route index element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/stake" element={<Stake />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/dao" element={<DAO />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/contributions" element={<Contributions />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App