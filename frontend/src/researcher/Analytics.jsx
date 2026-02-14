import React, { useState, useEffect } from 'react';
import API from '../api';
import { 
  BarChart3, TrendingUp, Activity, 
  CheckCircle2, AlertCircle, Clock, Search
} from 'lucide-react';

const ResearchAnalytics = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetching the global registry counts from your admin stats endpoint
    API.get('/api/admin/stats')
      .then(res => setStats(res.data))
      .catch(err => console.error("Telemetry Sync Error", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="p-10 font-mono text-purple-600 animate-pulse flex items-center gap-2">
      <Activity className="animate-spin" /> GENERATING ANALYTIC MODELS...
    </div>
  );

  return (
    <div className="space-y-8 font-mono animate-in fade-in duration-700">
      <header>
        <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">Research Intelligence</h2>
        <p className="text-purple-500 text-[10px] font-bold uppercase mt-1 tracking-widest">Advanced Telemetry Distribution Analysis</p>
      </header>

      {/* REGISTRY DENSITY GRAPH */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <h3 className="text-xs font-black uppercase text-slate-400 mb-6 flex items-center gap-2">
            <BarChart3 size={16} className="text-purple-600" /> Database Saturation
          </h3>
          <div className="space-y-5">
            {Object.entries(stats).map(([label, value]) => (
              <div key={label}>
                <div className="flex justify-between text-[10px] font-black uppercase mb-1">
                  <span className="text-slate-500">{label.replace(/_/g, ' ')}</span>
                  <span className="text-slate-900 font-bold">{value} Units</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full transition-all duration-1000" 
                    style={{ width: `${(value / Math.max(...Object.values(stats))) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SCIENTIFIC STATUS SUMMARY */}
        <div className="bg-indigo-950 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
          <Search className="absolute -right-4 -top-4 size-32 text-white/5" />
          <h3 className="font-black uppercase mb-6 flex items-center gap-2">
            <TrendingUp size={16} className="text-purple-400" /> Operational Insights
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 size={12} className="text-emerald-400" />
                <span className="text-[9px] font-black uppercase text-indigo-200">Integrity</span>
              </div>
              <p className="text-2xl font-black">99.8%</p>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
              <div className="flex items-center gap-2 mb-1">
                <Clock size={12} className="text-amber-400" />
                <span className="text-[9px] font-black uppercase text-indigo-200">Sync Rate</span>
              </div>
              <p className="text-2xl font-black">2.4ms</p>
            </div>
          </div>

          <div className="mt-8 p-5 bg-white/5 rounded-2xl border border-white/10 italic text-xs text-indigo-100 leading-relaxed">
            "Discovery velocity is currently optimal. Registry density indicates high sector activity in the '{Object.keys(stats)[0] || 'Celestial'}' module."
          </div>
        </div>
      </div>

      {/* MISSION SUCCESS CHART PLACEHOLDER */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h3 className="text-lg font-black text-slate-900 uppercase">Scientific Feed</h3>
          <p className="text-xs text-slate-400 font-bold uppercase">Real-time telemetry synchronization active</p>
        </div>
        <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-emerald-500 animate-ping"></div>
            <span className="text-[10px] font-black text-emerald-600 uppercase">System Nominal</span>
        </div>
      </div>
    </div>
  );
};

export default ResearchAnalytics;