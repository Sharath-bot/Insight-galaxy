import React, { useEffect, useState } from 'react';
import API from '../api';
import { Plane, Zap, Shield, Database, Search, Activity } from 'lucide-react';

const Spacecraft = () => {
  const [vessels, setVessels] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchSpacecraft = async () => {
      try {
        // GET request to the spacecraft table
        const res = await API.get('/api/spacecraft');
        setVessels(res.data);
      } catch (err) {
        console.error("Sensor failure: Unable to sync spacecraft telemetry.");
      }
    };
    fetchSpacecraft();
  }, []);

  const filteredVessels = vessels.filter(v => 
    v.name.toLowerCase().includes(search.toLowerCase()) ||
    v.type?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-purple-900 uppercase">Spacecraft Registry</h2>
          <p className="text-purple-400 text-[10px] font-bold uppercase tracking-[0.3em]">Fleet Status & Vessel Specifications</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 size-4 text-purple-400" />
          <input 
            type="text" 
            placeholder="Identify vessel..."
            className="pl-10 pr-4 py-2 bg-white border border-purple-100 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none w-64"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVessels.map((vessel) => (
          <div key={vessel.spacecraft_id} className="bg-white rounded-3xl p-6 border border-purple-50 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-purple-900 rounded-2xl group-hover:scale-110 transition-transform">
                <Plane className="size-6 text-purple-300" />
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                <Activity className="size-3" />
                <span className="text-[10px] font-black uppercase">{vessel.status || 'Nominal'}</span>
              </div>
            </div>

            <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight mb-4">{vessel.name}</h3>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Class</p>
                <div className="flex items-center gap-2 text-slate-700">
                  <Shield className="size-3" />
                  <span className="text-xs font-bold">{vessel.type || 'Orbiter'}</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Fuel Type</p>
                <div className="flex items-center gap-2 text-slate-700">
                  <Zap className="size-3" />
                  <span className="text-xs font-bold">{vessel.fuel_type || 'Liquid O2'}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-400">
                <Database className="size-3" />
                <span className="text-[10px] font-bold uppercase">ID: {vessel.spacecraft_id}</span>
              </div>
              <button className="text-[10px] font-black text-purple-600 uppercase hover:underline">
                Maintenance Logs
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Spacecraft;