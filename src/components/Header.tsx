import React from 'react';

export const Header: React.FC = () => (
  <header className="bg-slate-900 border-b border-slate-800 px-4 py-3">
    <div className="max-w-6xl mx-auto flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg">
          🏨
        </div>
        <div>
          <h1 className="text-sm md:text-base font-bold text-white tracking-wide">Grand Horizon Hotel</h1>
          <p className="text-xs text-slate-400">Multi-Agent Customer Service & Staf Manusia</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Semua Agen Aktif
        </span>
      </div>
    </div>
  </header>
);
