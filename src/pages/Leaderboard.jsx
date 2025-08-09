import React from 'react'

const Leaderboard = () => {
  const rows = Array.from({length:10}).map((_,i)=>({name:`Dev #${i+1}`, score: Math.round(Math.random()*1000)}))
  return (
    <div className="p-6 rounded-xl border border-white/10 bg-white/5">
      <h2 className="text-xl font-semibold">Leaderboard</h2>
      <div className="mt-4 divide-y divide-white/10">
        {rows.map((r,i)=> (
          <div key={i} className="py-3 flex items-center justify-between">
            <span className="text-sm text-[var(--muted)]">#{i+1}</span>
            <span className="font-medium">{r.name}</span>
            <span className="text-success font-semibold">{r.score}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Leaderboard
