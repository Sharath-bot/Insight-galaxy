import React from 'react';
import { Rocket, Globe, Star, Microscope } from 'lucide-react';

const ResearcherDashboard = () => {
  return (
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
  );
};

// Helper component for the cards
const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
    <div className={`p-2.5 bg-slate-50 rounded-xl ${color} w-fit mb-4`}>
      <Icon className="size-5" />
    </div>
    <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{title}</h3>
    <p className="text-2xl font-black text-slate-900 mt-1">{value}</p>
  </div>
);

export default ResearcherDashboard;