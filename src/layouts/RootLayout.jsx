import React from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import { colors } from '../theme/colors'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/stake', label: 'Stake' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/leaderboard', label: 'Leaderboard' },
  { to: '/dao', label: 'DAO' },
  { to: '/challenges', label: 'Challenges' },
  { to: '/chat', label: 'Chat' },
  { to: '/profile', label: 'Profile' },
]

const RootLayout = () => {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-white">
      <header className="sticky top-0 z-40 backdrop-blur border-b border-white/5 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full" style={{backgroundImage: 'linear-gradient(135deg, #E84142, #9B2CFF)'}}/>
            <span className="font-bold tracking-tight">CodeStake</span>
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
            <span className="hidden sm:inline text-xs text-[var(--muted)]">Avalanche Fuji</span>
            <button className="px-3 py-1.5 rounded-md font-medium" style={{backgroundImage: 'linear-gradient(135deg, #E84142, #9B2CFF)'}}>
              Connect Wallet
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Outlet />
      </main>
      <footer className="py-8 text-center text-xs text-[var(--muted)]">© {new Date().getFullYear()} CodeStake • Built on Avalanche</footer>
    </div>
  )
}

export default RootLayout
