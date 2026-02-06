import React, { useEffect, useState } from 'react';
import API from '../api';
import { BarChart3, Rocket, Globe, Star, Activity, Loader2 } from 'lucide-react';

const AnalyticsDashboard = () => {
  const [stats, setStats] = useState({ missions: 0, objects: 0, discoveries: 0, astronauts: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Fetching multiple table counts simultaneously
        const [m, o, d, a] = await Promise.all([
          API.get('/api/missions'),
          API.get('/api/celestial_objects'),
          API.get('/api/discoveries'),
          API.get('/api/astronauts')
        ]);
        
        setStats({
          missions: m.data.length,
          objects: o.data.length,
          discoveries: d.data.length,
          astronauts: a.data.length
        });
      } catch (err) {
        console.error("Telemetry failure:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <div className="p-10 text-slate-400 font-mono flex items-center gap-2"><Loader2 className="animate-spin" /> CALCULATING METRICS...</div>;

  const dataPoints = [
    { label: 'Active Missions', value: stats.missions, icon: Rocket, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Mapped Objects', value: stats.objects, icon: Globe, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Scientific Findings', value: stats.discoveries, icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-50' },
    { label: 'Crew Personnel', value: stats.astronauts, icon: Activity, color: 'text-purple-500', bg: 'bg-purple-50' },
  ];

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-slate-900 text-white rounded-2xl"><BarChart3 /></div>
        <div>
          <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Mission Intelligence</h2>
          <p className="text-slate-400 text-xs font-mono uppercase">Real-time data synchronization across all sectors</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dataPoints.map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-blue-300 transition-all">
            <div className={`p-3 ${item.bg} ${item.color} rounded-2xl w-fit mb-4`}>
              <item.icon className="size-6" />
            </div>
            <div className="text-3xl font-black text-slate-900">{item.value}</div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{item.label}</div>
          </div>
        ))}
      </div>

      {/* Visual Analytics Bar (Simple CSS Implementation) */}
      <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl">
        <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-8 text-slate-500">Discovery Distribution</h3>
        <div className="space-y-6">
          {['Deep Space', 'Planetary', 'Stellar'].map((type, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                <span>{type} Observations</span>
                <span className="text-cyan-400">{Math.floor(Math.random() * 40) + 60}% Efficiency</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full transition-all duration-1000" 
                  style={{ width: `${Math.floor(Math.random() * 40) + 60}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;