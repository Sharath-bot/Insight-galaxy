import React, { useEffect, useState } from 'react';
import API from '../api';
import {  Cpu, Settings, Activity, Search } from 'lucide-react';

const Telescopes = () => {
  const [scopes, setScopes] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchScopes = async () => {
      try {
        const res = await API.get('/api/telescopes');
        setScopes(res.data);
      } catch (err) {
        console.error("Optics failure: Unable to sync telescope array.");
      }
    };
    fetchScopes();
  }, []);

  const filteredScopes = scopes.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.type?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-purple-900 uppercase">Telescope Array</h2>
          <p className="text-purple-400 text-[10px] font-bold uppercase tracking-[0.3em]">Optical & Radio Imaging Systems</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 size-4 text-purple-400" />
          <input 
            type="text" 
            placeholder="Search optics..."
            className="pl-10 pr-4 py-2 bg-white border border-purple-100 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredScopes.map((scope) => (
          <div key={scope.telescope_id} className="bg-white rounded-3xl p-6 border border-purple-50 shadow-sm hover:shadow-xl transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-slate-900 rounded-2xl">
                <Search className="size-6 text-purple-400" />
              </div>
              <span className="text-[10px] font-black px-2 py-1 bg-purple-50 text-purple-600 rounded uppercase">
                {scope.type || 'Optical'}
              </span>
            </div>

            <h3 className="text-lg font-black text-slate-800 uppercase mb-4">{scope.name}</h3>

            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-bold uppercase">Aperture</span>
                <span className="text-slate-700 font-mono font-bold">{scope.aperture_m || '0'}m</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-bold uppercase">Location ID</span>
                <span className="text-slate-700 font-mono font-bold">{scope.observatory_id}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-50 flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-purple-50 text-purple-600 rounded-xl text-[10px] font-black uppercase hover:bg-purple-600 hover:text-white transition-all">
                <Activity className="size-3" /> Status
              </button>
              <button className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:text-slate-900 transition-colors">
                <Settings className="size-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Telescopes;