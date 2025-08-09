import React, { useState } from 'react'

const Stake = () => {
  const [amount, setAmount] = useState(100)
  const apy = 12.5

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="p-6 rounded-xl border border-white/10 bg-white/5">
        <h2 className="text-xl font-semibold">Stake Tokens</h2>
        <div className="mt-4">
          <input type="range" min="0" max="1000" value={amount} onChange={e=>setAmount(Number(e.target.value))} className="w-full"/>
          <div className="mt-2 text-sm text-[var(--muted)]">Amount: <span className="text-white font-medium">{amount}</span></div>
        </div>
        <div className="mt-4 p-4 rounded-lg bg-black/30 border border-white/10">
          <div className="text-sm">APY: <span className="text-success">{apy}%</span></div>
          <div className="text-sm mt-1">Est. Annual Yield: <span className="font-medium">{((amount*apy)/100).toFixed(2)}</span></div>
        </div>
        <button className="mt-4 px-5 py-3 rounded-md font-semibold text-white" style={{backgroundImage:'linear-gradient(135deg,#E84142,#9B2CFF)'}}>Confirm Stake</button>
      </div>
      <div className="p-6 rounded-xl border border-white/10 bg-white/5">3D Token Preview (placeholder)</div>
    </div>
  )
}

export default Stake
