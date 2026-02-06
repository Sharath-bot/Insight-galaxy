import React, { useEffect, useState } from 'react';
import API from '../api';
import { Plane, Building2, Loader2, Zap, Cog, Users } from 'lucide-react';

const Spacecraft = () => {
  const [fleet, setFleet] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFleetData = async () => {
      try {
        const res = await API.get('/api/spacecraft');
        setFleet(res.data);
      } catch (err) {
        console.error("Hangar link failure:", err);
      } finally {
        setLoading(false);
      }
    };
    loadFleetData();
  }, []);

  if (loading) return (
    <div className="p-10 text-slate-400 font-mono flex items-center gap-2">
      <Loader2 className="animate-spin size-4" /> SCANNING HANGAR...
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div>
        <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Spacecraft Inventory</h2>
        <p className="text-slate-400 text-xs font-mono uppercase tracking-widest">Technical specifications and manufacturing logs</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {fleet.map((ship) => (
          <div key={ship.spacecraft_id} className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-2xl group transition-all hover:border-blue-500/50">
            <div className="flex justify-between items-start">
              <div className="p-4 bg-blue-500/10 text-blue-400 rounded-2xl">
                <Plane className="size-8" />
              </div>
              <div className="text-right">
                <span className="block text-[9px] font-black text-slate-500 uppercase mb-1">Vehicle Class</span>
                <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-[10px] font-black uppercase tracking-tighter">
                  {/* Using 'type' column directly from your table */}
                  {ship.type || 'Standard Vessel'}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-2xl font-black text-white uppercase tracking-tight">
                {ship.name || "Unknown Craft"}
              </h3>
              <div className="flex items-center gap-2 mt-2 text-slate-400 text-xs">
                <Cog className="size-3 text-blue-500" />
                {/* Using 'manufacturer' column directly from your table as requested */}
                <span className="font-mono uppercase tracking-wider">
                  Manufacturer: {ship.manufacturer || "Data Not Found"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase mb-1">
                  <Users className="size-3" /> Crew Capacity
                </div>
                <div className="text-xl font-black text-white">{ship.capacity || '0'}</div>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase mb-1">
                  <Zap className="size-3" /> Status
                </div>
                <div className="text-xl font-black text-emerald-400">OPERATIONAL</div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center text-[10px] font-mono text-slate-500">
               <span>SYS_ID: {ship.spacecraft_id}</span>
               <span className="text-blue-500/50">ENCRYPTED_LOG_ACTIVE</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Spacecraft;