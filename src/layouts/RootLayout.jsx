import React, { useState } from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import { FaSearch } from 'react-icons/fa'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import SearchModal from '../components/SearchModal'
import NotificationSystem from '../components/NotificationSystem'
import { colors } from '../theme/colors'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/stake', label: 'Stake' },
  { to: '/quests', label: 'Quests' },
  { to: '/leaderboard', label: 'Leaderboard' },
  { to: '/challenges', label: 'Challenges' },
  { to: '/contributions', label: 'Contributions' },
  { to: '/profile', label: 'Profile' },
]

const RootLayout = () => {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-white">
      <header className="sticky top-0 z-40 backdrop-blur border-b border-white/5 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full" style={{backgroundImage: 'linear-gradient(135deg, #E84142, #9B2CFF)'}}/>
            <span className="font-bold tracking-tight">GitStake</span>
          </div>
          <nav className="hidden md:flex items-center gap-4 text-sm">
            {navItems.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({isActive}) => `px-3 py-1.5 rounded-md hover:bg-white/5 transition ${isActive ? 'bg-white/10' : ''}`}
              >{n.label}</NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            {/* <button
              onClick={() => setShowSearch(true)}
              className="p-2 text-gray-400 hover:text-white transition-colors"
              title="Search GitHub"
            >
              <FaSearch />
            </button> */}
            {/* <NotificationSystem /> */}
            <span className="hidden sm:inline text-xs text-[var(--muted)]">Avalanche Fuji</span>
            {/* Wallet connection moved to auth page */}
            <ConnectButton />
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Outlet />
      </main>
      <footer className="py-8 text-center text-xs text-[var(--muted)]">© {new Date().getFullYear()} GitStake • Built on Avalanche</footer>
      
      <SearchModal 
        isOpen={showSearch} 
        onClose={() => setShowSearch(false)} 
      />
    </div>
  )
}

export default RootLayout
