import React from 'react';
import { Outlet, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { cn } from '../utils'; 

import {
  Rocket,
  Building2,
  Globe,
  UserCircle,
  Plane,
  Radio,
  LayoutDashboard,
  BarChart3,
  LogOut,
  Microscope,
  Search,
  Star,
  MapPin
} from 'lucide-react';

const navigation = [
  
  { name: 'Missions', href: '/researcher/missions', icon: Rocket },
  { name: 'Celestial Objects', href: '/researcher/celestial_objects', icon: Globe },
  { name: 'Discoveries', href: '/researcher/discoveries', icon: Star },
  { name: 'Observations', href: '/researcher/observations', icon: Search },
  { name: 'Instruments', href: '/researcher/instruments', icon: Microscope },
  { name: 'Observatories', href: '/researcher/observatories', icon: Radio },
 
  { name: 'Agencies', href: '/researcher/agencies', icon: Building2 },
  { name: 'Analytics', href: '/researcher/analytics', icon: BarChart3 }, // Added Analytics
];

export default function ResearcherPortal({ user, setUser }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Role Security: role_id 2 = Researcher
  if (!user || user.role_id !== 2) {
    return <Navigate to="/" />;
  }

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-slate-50 font-mono">
      {/* SIDEBAR */}
      <aside className="w-64 bg-gradient-to-b from-purple-900 to-indigo-950 text-white flex flex-col shadow-2xl">
        <div className="p-6 border-b border-purple-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg border border-purple-400/30">
              <Search className="size-6 text-purple-300" />
            </div>
            <div>
              <h1 className="font-bold text-sm uppercase tracking-tighter">Insight Galaxy</h1>
              <p className="text-[10px] text-purple-300 uppercase tracking-widest">Research Division</p>
            </div>
          </div>
        </div>

        {/* NAVIGATION AREA */}
        <div className="flex-1 overflow-y-auto px-3 py-4 custom-scrollbar">
          <nav className="space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;
              
              return (
                <button
                  key={item.name}
                  onClick={() => navigate(item.href)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[11px] uppercase tracking-widest transition-all duration-200',
                    isActive
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/40 translate-x-1'
                      : 'text-purple-200/70 hover:bg-purple-800/50 hover:text-white'
                  )}
                >
                  <Icon className="size-4" />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
      
        {/* LOGOUT AREA */}
        <div className="p-4 border-t border-purple-800/50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs uppercase text-purple-300 hover:bg-red-500/20 hover:text-red-300 transition-all"
          >
            <LogOut className="size-4" />
            <span>Abort Session</span>
          </button>
        </div>
      </aside>
    
      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-auto bg-[#f8fafc]">
        <div className="p-8">
            <Outlet />
            
            {/* Dashboard Overview - only shows at the root /researcher path */}
            {location.pathname === '/researcher' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <header className="mb-8">
                      <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Scientific Overview</h2>
                      <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em]">Telemetry synchronized with central database</p>
                    </header>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <StatCard title="Active Missions" value="14" icon={Rocket} color="text-purple-600" />
                        <StatCard title="Mapped Objects" value="1,042" icon={Globe} color="text-blue-600" />
                        <StatCard title="Total Discoveries" value="84" icon={Star} color="text-amber-500" />
                        <StatCard title="Instruments" value="56" icon={Microscope} color="text-emerald-600" />
                    </div>

                    <div className="mt-12 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm border-t-4 border-t-purple-500">
                        <h3 className="text-lg font-black uppercase text-slate-800 mb-2">Researcher Instructions</h3>
                        <p className="text-slate-500 text-sm italic">
                          Welcome to the Research Division. Use the sidebar to log new discoveries, monitor satellite instruments, and manage mission telemetry. 
                        </p>
                    </div>
                </div>
            )}
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }) {
    return (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-2.5 bg-slate-50 rounded-xl ${color} border border-slate-100`}>
                    <Icon className="size-5" />
                </div>
                <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-ping"></div>
            </div>
            <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{title}</h3>
            <p className="text-2xl font-black text-slate-900 mt-1">{value}</p>
        </div>
    );
}