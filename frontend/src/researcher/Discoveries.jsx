import React, { useState, useEffect } from 'react';
import API from '../api';
import { Microscope, Star, Calendar, Trash2, Info, MapPin } from 'lucide-react';

const AdminDiscoveries = ({ user }) => {
  // STRICT ROLE GUARD: Only Admin (Role 1) can modify
  const isAdmin = user?.role_id === 1;

  const [discoveries, setDiscoveries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/api/discoveries')
      .then(res => setDiscoveries(res.data || []))
      .catch(err => console.error("Database Link Failure", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-10 font-mono text-amber-600 animate-pulse uppercase">Syncing Discovery Logs...</div>;

  return (
    <div className="space-y-8 font-mono">
      <header className="border-b border-slate-200 pb-6 flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Discovery Logs</h2>
          <p className="text-amber-500 text-[10px] font-bold uppercase tracking-widest mt-1">Confirmed Astronomical Findings</p>
        </div>
        {/* UI GUARD: Hidden for Researchers */}
        {isAdmin && (
          <button className="bg-amber-500 text-white px-6 py-2 rounded-2xl text-[10px] font-black uppercase">
            New Discovery
          </button>
        )}
      </header>

      <div className="grid grid-cols-1 gap-4">
        {discoveries.map(disc => (
          <div key={disc.discovery_id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between group">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-amber-50 text-amber-500 rounded-2xl group-hover:bg-amber-500 group-hover:text-white transition-all">
                <Star size={24} />
              </div>
              <div>
                {/* DATA FIX: Mapping to your specific SQL columns 'description' and 'discovery_date' */}
                <h4 className="font-black text-slate-900 uppercase text-lg">
                  {disc.description || `Uncatalogued Event #${disc.discovery_id}`}
                </h4>
                <div className="flex gap-6 mt-1">
                  <p className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
                    <Calendar size={12}/> {disc.discovery_date || 'Date Unknown'}
                  </p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
                    <MapPin size={12}/> Object ID: {disc.object_id}
                  </p>
                  {disc.mission_id && (
                    <p className="text-[10px] text-indigo-400 font-black uppercase">
                      Mission Ref: {disc.mission_id}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* ACTION GUARD: Edit/Delete icons hidden for Researchers */}
            {isAdmin && (
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                  <Trash2 size={18} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDiscoveries;