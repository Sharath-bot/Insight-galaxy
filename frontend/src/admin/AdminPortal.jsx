import React from 'react';
import { useNavigate, Navigate, Outlet } from 'react-router-dom';
import {   useLocation } from 'react-router-dom';
import {   Home } from 'lucide-react'; 
import API from '../api'

// If Telescope fails, replace it with Rocket in the sidebar code below.
import { cn } from './utils'; // Assumes you have a small utility for class joining
import {
  LayoutDashboard,
  Users,
  Shield,
  Globe,
  MapPin,
  Building2,
  Rocket,      // Added back
  UserCircle,
  Plane,
  Radio,
   // Added back (Replaced Telescope)
  Microscope,
  Search,
  Star,
  Heart,
  MessageSquare,
  UserPlus,
  LogOut
} from 'lucide-react';

const navigation = [
  { name: 'Overview', href: '/admin', icon: LayoutDashboard },
  { name: 'Personnel', href: '/admin/users', icon: Users },
  { name: 'Roles & Permissions', href: '/admin/roles', icon: Shield },
  { name: 'Nations', href: '/admin/countries', icon: MapPin },
  { name: 'Agencies', href: '/admin/agencies', icon: Building2 },
  { name: 'Spacecraft', href: '/admin/spacecraft', icon: Plane },
  { name: 'Astronaut Corps', href: '/admin/astronauts', icon: UserCircle },
  { name: 'Missions', href: '/admin/missions', icon: Rocket },
  { name: 'Celestial Objects', href: '/admin/objects', icon: Globe },
  { name: 'Observatories', href: '/admin/observatories', icon: Radio },
  // Change the Telescope line to use the "Search" icon which we know exists
{ name: 'Telescopes', href: '/admin/telescopes', icon: Search },
  { name: 'Instruments', href: '/admin/instruments', icon: Microscope },
  { name: 'Observations', href: '/admin/observations', icon: Search },
  { name: 'Discoveries', href: '/admin/discoveries', icon: Star },
  { name: 'Favourites', href: '/admin/favourites', icon: Heart },
  { name: 'User Feedback', href: '/admin/feedback', icon: MessageSquare },
  { name: 'Register Cadet', href: '/admin/create-account', icon: UserPlus },
];
export default function AdminPortal({ user, setUser }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Role Security Check [cite: 7, 10-12]
  if (!user || user.role_id !== 1) {
    return <Navigate to="/" />;
  }

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-slate-50 font-mono">
      {/* Sidebar - Command Center */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col border-r border-slate-800">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Rocket className="size-6 text-blue-400" />
            </div>
            <div>
              <h1 className="font-bold text-sm uppercase tracking-tighter">Insight Galaxy</h1>
              <p className="text-[10px] text-slate-400 uppercase">Admin Command</p>
            </div>
          </div>
        </div>

        {/* Navigation Area */}
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
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs uppercase tracking-widest transition-all',
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  )}
                >
                  <Icon className="size-4" />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs uppercase text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="size-4" />
            <span>Terminate Session</span>
          </button>
        </div>
      </aside>

      {/* Main Mission Control Content */}
      <main className="flex-1 overflow-auto bg-slate-50 relative">
        <div className="p-8">
            <Outlet />
            {/* If on base route, show quick summary stats [cite: 1, 10, 37] */}
            {location.pathname === '/admin' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <StatCard title="Total Personnel" value="124" icon={Users} color="text-blue-600" />
                    <StatCard title="Active Missions" value="12" icon={Rocket} color="text-purple-600" />
                    <StatCard title="Celestial Objects" value="892" icon={Globe} color="text-emerald-600" />
                </div>
            )}
        </div>
      </main>
    </div>
  );
}

// Quick Helper Component for Dashboard Overview
function StatCard({ title, value, icon: Icon, color }) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-2 bg-slate-100 rounded-lg ${color}`}>
                    <Icon className="size-5" />
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Real-time</span>
            </div>
            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider">{title}</h3>
            <p className="text-2xl font-black text-slate-900 mt-1">{value}</p>
        </div>
    );
}