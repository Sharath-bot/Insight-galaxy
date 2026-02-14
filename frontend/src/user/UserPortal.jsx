import React from 'react';
import { Outlet, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Star, Home, Rocket, Building2, Globe, LogOut } from 'lucide-react';

export default function UserPortal({ user, setUser }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Role Security Guard
  if (!user || user.role_id !== 3) {
    return <Navigate to="/" />;
  }

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  const menuItems = [
    { name: 'Dashboard', href: '/user', icon: Home },
    { name: 'Missions', href: '/user/missions', icon: Rocket },
    { name: 'Agencies', href: '/user/agencies', icon: Building2 },
    //{ name: 'Star Catalog', href: '/user/objects', icon: Globe },
    { name: 'Favorites', href: '/user/favorites', icon: Star },
  ];

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-950 text-white flex flex-col shadow-2xl">
        <div className="p-8 border-b border-white/10">
          <h1 className="font-black text-xl tracking-tighter uppercase">Insight Galaxy</h1>
          <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest mt-1">Explorer Access</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => navigate(item.href)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                location.pathname === item.href ? 'bg-indigo-600 text-white shadow-lg' : 'text-indigo-200 hover:bg-white/5'
              }`}
            >
              <item.icon size={18} />
              <span>{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/10">
          <button onClick={handleLogout} className="flex items-center gap-3 text-xs font-bold text-indigo-300 hover:text-red-400 uppercase tracking-widest">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Content Area */}
      <main className="flex-1 overflow-auto p-10">
        <Outlet context={user} />
      </main>
    </div>
  );
}