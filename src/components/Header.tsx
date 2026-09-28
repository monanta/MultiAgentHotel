import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-slate-950 border-b border-slate-800 px-4 py-3">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-amber-400 text-slate-950 font-bold flex items-center justify-center text-xs">
            GH
          </div>
          <div>
            <h1 className="text-sm font-bold text-white">Grand Horizon Hotel</h1>
            <p className="text-[11px] text-slate-400">Multi-Agent Customer Service</p>
          </div>
        </div>

        <div className="text-xs text-slate-400">
          <span className="text-emerald-400 font-medium">● Sistem Aktif</span>
        </div>
      </div>
    </header>
  );
};
