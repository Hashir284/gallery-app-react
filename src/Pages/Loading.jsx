import React from 'react'

const Loading = () => {
  return (
      <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center gap-4 p-6 select-none relative overflow-hidden">

        <div className="absolute w-[300px] h-[300px] bg-amber-500/5 rounded-full blur-[120px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        </div>
        
        <div className="relative flex items-center justify-center w-16 h-16">
          <div className="w-12 h-12 border-2 border-slate-900 border-t-amber-400 border-r-orange-500/80 rounded-full animate-spin"></div>
        </div>

        <div className="text-center mt-2 z-10">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent animate-pulse">
            Verifying Session
          </h3>
          <p className="text-[10px] font-mono text-slate-500 tracking-wider mt-1.5 uppercase">
            Securing environment...
          </p>
        </div>

      </div>
  )
}

export default Loading
