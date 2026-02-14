import React, { useState, useEffect } from 'react';
import API from '../api';
import { Rocket, Star, Globe, ShieldCheck, Activity } from 'lucide-react';

const UserDashboard = () => {
  const [stats, setStats] = useState({ Missions: 0, Celestial_Objects: 0, Discoveries: 0 });

  useEffect(() => {
    // Reusing existing stats for the public dashboard
    API.get('/api/admin/stats')
      .then(res => setStats(res.data))
      .catch(err => console.error("Dashboard sync failure", err));
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-700 font-sans">
      <header>
        <h2 className="text-3xl font-black text-indigo-950 uppercase tracking-tighter">Explorer Dashboard</h2>
        <p className="text-slate-500 text-sm italic">Real-time synchronization with Insight Galaxy telemetry.</p>
      </header>

      {/* QUICK METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
          <Rocket className="text-indigo-600 mb-2" size={24} />
          <p className="text-[10px] font-black text-slate-400 uppercase">Active Missions</p>
          <p className="text-2xl font-black text-slate-900">{stats.Missions || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
          <Globe className="text-blue-600 mb-2" size={24} />
          <p className="text-[10px] font-black text-slate-400 uppercase">Mapped Objects</p>
          <p className="text-2xl font-black text-slate-900">{stats.Celestial_Objects || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
          <Star className="text-amber-500 mb-2" size={24} />
          <p className="text-[10px] font-black text-slate-400 uppercase">Discoveries</p>
          <p className="text-2xl font-black text-slate-900">{stats.Discoveries || 0}</p>
        </div>
      </div>

      {/* SYSTEM STATUS CARD */}
      <div className="bg-indigo-900 p-8 rounded-[2.5rem] text-white flex items-center justify-between relative overflow-hidden">
        <Activity className="absolute -right-4 -top-4 size-32 text-white/5" />
        <div className="flex items-center gap-4 relative z-10">
          <div className="p-3 bg-white/10 rounded-2xl">
            <ShieldCheck size={24} className="text-emerald-400" />
          </div>
          <div>
            <h3 className="font-black uppercase text-sm">Access Status: Level 3 Nominal</h3>
            <p className="text-xs text-indigo-200">Your connection to the central mission registry is secure and active.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 relative z-10">
          <div className="size-2 rounded-full bg-emerald-500 animate-ping"></div>
          <span className="text-[10px] font-black uppercase tracking-widest">Live Sync</span>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
