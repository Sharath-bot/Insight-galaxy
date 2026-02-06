import React from 'react';
import { Outlet, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { cn } from '../utils';
import {
  Globe,
  Star,
  Rocket,

  LayoutDashboard,
  Heart,
  LogOut,
  User as UserIcon
} from 'lucide-react';

const navigation = [
  { name: 'My Dashboard', href: '/user', icon: LayoutDashboard },
  { name: 'Star Map', href: '/user/objects', icon: Globe },
  { name: 'Discoveries', href: '/user/discoveries', icon: Star },
  { name: 'Mission Logs', href: '/user/missions', icon: Rocket },

  { name: 'Favorites', href: '/user/favorites', icon: Heart },
];

export default function UserPortal({ user, setUser }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Role Security: role_id 3 is the standard User
  if (!user || user.role_id !== 3) {
    return <Navigate to="/" />;
  }

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-slate-50 font-mono">
      <aside className="w-64 bg-gradient-to-b from-emerald-900 to-teal-950 text-white flex flex-col shadow-2xl">
        <div className="p-6 border-b border-emerald-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 rounded-lg border border-emerald-400/30">
              <UserIcon className="size-6 text-emerald-300" />
            </div>
            <div>
              <h1 className="font-bold text-sm uppercase tracking-tighter">Insight Galaxy</h1>
              <p className="text-[10px] text-emerald-300 uppercase tracking-widest">User Terminal</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4">
          <nav className="space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;
              
              return (
                <button
                  key={item.name}
                  onClick={() => navigate(item.href)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[11px] uppercase tracking-widest transition-all',
                    isActive
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/40'
                      : 'text-emerald-200/70 hover:bg-emerald-800/50 hover:text-white'
                  )}
                >
                  <Icon className="size-4" />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-emerald-800/50">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs uppercase text-emerald-300 hover:bg-red-500/20 hover:text-red-300 transition-all">
            <LogOut className="size-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto bg-[#f0fdf4]">
        <div className="p-8">
            <Outlet />
            {location.pathname === '/user' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <header className="mb-8">
                      <h2 className="text-2xl font-black text-emerald-900 uppercase">Welcome Back</h2>
                      <p className="text-emerald-600 text-xs font-bold uppercase tracking-[0.2em]">Viewing Insight Galaxy Records</p>
                    </header>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm">
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Role Assigned</p>
                            <p className="text-xl font-black text-emerald-700 mt-1 uppercase tracking-tighter">Standard User</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </main>
    </div>
  );
}