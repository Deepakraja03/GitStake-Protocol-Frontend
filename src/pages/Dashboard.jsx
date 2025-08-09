import React from 'react'

const Dashboard = () => {
  return (
    <div className="grid lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 space-y-4">
        <div className="p-6 rounded-xl border border-white/10 bg-white/5">Contribution Grid (placeholder)</div>
        <div className="p-6 rounded-xl border border-white/10 bg-white/5">Yield Chart (placeholder)</div>
      </div>
      <div className="space-y-4">
        <div className="p-6 rounded-xl border border-white/10 bg-white/5">Staking Overview (placeholder)</div>
        <div className="p-6 rounded-xl border border-white/10 bg-white/5">Quests (placeholder)</div>
        <div className="p-6 rounded-xl border border-white/10 bg-white/5">Leaderboard Snapshot (placeholder)</div>
      </div>
    </div>
  )
}

export default Dashboard
