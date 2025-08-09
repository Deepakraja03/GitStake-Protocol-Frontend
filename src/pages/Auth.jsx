import React from 'react'

const Auth = () => {
  return (
    <div className="p-6 rounded-xl border border-white/10 bg-white/5 max-w-md mx-auto">
      <h2 className="text-xl font-semibold text-center">Connect</h2>
      <div className="mt-6 space-y-3">
        <button className="w-full px-5 py-3 rounded-md font-semibold text-white" style={{backgroundImage:'linear-gradient(135deg,#E84142,#9B2CFF)'}}>Connect Wallet</button>
        <button className="w-full px-5 py-3 rounded-md font-semibold border border-white/10 hover:bg-white/5">Continue with GitHub</button>
      </div>
    </div>
  )
}

export default Auth
