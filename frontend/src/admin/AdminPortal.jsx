import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import API from '../api';
import { 
  LayoutDashboard, Rocket, Users, Globe, Building2, 
  Plane, LogOut, ChevronRight, Database, Search, Microscope, 
  Eye, HardDrive, UserCheck, Heart, MessageSquare, Activity, PieChart
} from 'lucide-react';

export default function AdminPortal({ user, setUser }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [dbOverview, setDbOverview] = useState({});

  // Standard navigation array
  const navigation = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Roles', href: '/admin/roles', icon: UserCheck },
    { name: 'Missions', href: '/admin/missions', icon: Rocket },
    { name: 'Celestial Objects', href: '/admin/celestialobjects', icon: Search },
    { name: 'Astronauts', href: '/admin/astronauts', icon: Users },
    { name: 'Discoveries', href: '/admin/discoveries', icon: Microscope },
    { name: 'Agencies', href: '/admin/agencies', icon: Building2 },
    { name: 'Spacecraft', href: '/admin/spacecraft', icon: Plane },
    { name: 'Observatories', href: '/admin/observatories', icon: Building2 },
    { name: 'Telescopes', href: '/admin/telescopes', icon: Search},
    { name: 'Instruments', href: '/admin/instruments', icon: HardDrive },
    { name: 'Observations', href: '/admin/observations', icon: Eye },
    { name: 'Countries', href: '/admin/countries', icon: Globe },
    { name: 'User Favourites', href: '/admin/favourites', icon: Heart },
    { name: 'Feedback', href: '/admin/feedback', icon: MessageSquare },
  ];

  useEffect(() => {
    // Aligned with Python backend endpoint
    API.get('/api/admin/stats')
      .then(res => setDbOverview(res.data || {}))
      .catch(err => console.error("Database sync failed", err));
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('insight_user');
    if (setUser) setUser(null); //
    navigate('/');
  };

  const statsArray = Object.entries(dbOverview);
  const maxVal = Math.max(...Object.values(dbOverview), 1);
  const totalEntries = Object.values(dbOverview).reduce((a, b) => a + b, 0);

  return (
    <div className="flex h-screen bg-[#050505] font-mono text-slate-300 overflow-hidden">
      {/* CYBERPUNK SIDEBAR */}
      <aside className="w-64 bg-black border-r border-white/5 flex flex-col p-6 z-50">
        <div className="mb-8 flex items-center gap-3 border-b border-white/5 pb-6">
          <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.5)]">
            <Database size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xs font-black text-white uppercase tracking-widest">Insight Galaxy</h1>
            <p className="text-[7px] text-cyan-400 font-bold uppercase mt-1">System Root Admin</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto pr-2 scrollbar-none">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link key={item.name} to={item.href}
                className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                  isActive ? 'bg-white/10 text-cyan-400 border border-white/10' : 'text-slate-500 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={14} />
                  <span className="text-[9px] font-black uppercase tracking-widest">{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>
        <button onClick={handleLogout} className="mt-6 flex items-center gap-3 p-4 bg-red-500/5 border border-red-500/10 rounded-2xl text-red-500 hover:bg-red-500 hover:text-white transition-all text-[9px] font-black uppercase">
          <LogOut size={16} /> De-Authorize Session
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto bg-gradient-to-b from-[#0a0a0a] to-black">
        {location.pathname === '/admin' ? (
          <div className="p-10 space-y-8 max-w-7xl mx-auto">
            <header className="flex justify-between items-start">
              <div className="space-y-1">
                <h2 className="text-5xl font-black text-white uppercase tracking-tighter">Command Center</h2>
                <div className="flex items-center gap-2 text-cyan-500 text-[10px] font-bold uppercase">
                  <Activity size={12} /> Live Database Uplink Established
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-500 uppercase">Total Logged Entries</p>
                <p className="text-3xl font-black text-white leading-none">{totalEntries.toLocaleString()}</p>
              </div>
            </header>

            {/* VISUALIZATION SUITE */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* CHART 1: Radial Distribution (Advanced SVG) */}
              <div className="lg:col-span-1 bg-white/5 border border-white/5 p-8 rounded-[2.5rem] flex flex-col items-center justify-center relative group">
                 <div className="absolute inset-0 bg-cyan-500/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 <svg viewBox="0 0 100 100" className="w-48 h-48 transform -rotate-90">
                    {statsArray.map(([table, count], i) => {
                       const radius = 35 - (i * 2.5);
                       const circumference = 2 * Math.PI * radius;
                       const offset = circumference - (count / maxVal) * circumference;
                       const colors = ['#06b6d4', '#3b82f6', '#8b5cf6', '#d946ef', '#f43f5e', '#f59e0b'];
                       return (
                          <circle key={table} cx="50" cy="50" r={radius} fill="transparent"
                             stroke={colors[i % colors.length]} strokeWidth="2" strokeDasharray={circumference}
                             strokeDashoffset={offset} strokeLinecap="round" className="opacity-80 hover:opacity-100 transition-all duration-1000"
                          />
                       );
                    })}
                 </svg>
                 <div className="mt-6 text-center">
                    <PieChart size={20} className="mx-auto text-slate-500 mb-2" />
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Table Load Balance</p>
                 </div>
              </div>

              {/* CHART 2: Density Heatmap (Grid Based) */}
              <div className="lg:col-span-2 bg-white/5 border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden">
                <h3 className="text-[10px] font-black text-slate-500 uppercase mb-6 flex items-center gap-2">
                   <Activity size={14} className="text-cyan-500" /> Infrastructure Density
                </h3>
                <div className="grid grid-cols-5 gap-3">
                   {statsArray.map(([table, count]) => (
                     <div key={table} className="space-y-2">
                        <div className="h-32 bg-white/5 rounded-2xl relative overflow-hidden flex flex-col justify-end">
                           <div 
                              className="w-full bg-gradient-to-t from-cyan-500 to-blue-400 transition-all duration-1000 delay-100"
                              style={{ height: `${(count / maxVal) * 100}%` }}
                           >
                              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                           </div>
                        </div>
                        <p className="text-[8px] font-black text-slate-500 uppercase truncate text-center">{table.split('_')[0]}</p>
                     </div>
                   ))}
                </div>
              </div>
            </div>

            {/* COLORFUL DATA CARDS */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {statsArray.map(([table, count], i) => {
                const colors = [
                  'border-cyan-500/50 shadow-cyan-500/10',
                  'border-blue-500/50 shadow-blue-500/10',
                  'border-purple-500/50 shadow-purple-500/10',
                  'border-pink-500/50 shadow-pink-500/10',
                  'border-orange-500/50 shadow-orange-500/10'
                ];
                return (
                  <div key={table} className={`bg-white/5 p-5 rounded-3xl border ${colors[i % colors.length]} shadow-xl transition-all hover:-translate-y-1`}>
                    <p className="text-[8px] font-black text-slate-500 uppercase mb-1">{table.replace(/_/g, ' ')}</p>
                    <p className="text-2xl font-black text-white">{count.toLocaleString()}</p>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="p-8"><Outlet context={user} /></div>
        )}
      </main>
    </div>
  );
}