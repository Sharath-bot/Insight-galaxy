import React, { useEffect, useState } from 'react';
import API from '../api';
import { Radio, Map, Building, Wind, Search } from 'lucide-react';

const Observatories = () => {
  const [sites, setSites] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchSites = async () => {
      try {
        // GET request to the observatories table
        const res = await API.get('/api/observatories');
        setSites(res.data);
      } catch (err) {
        console.error("Signal interference: Observatory data unreachable.");
      }
    };
    fetchSites();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-purple-900 uppercase">Ground Stations</h2>
          <p className="text-purple-400 text-[10px] font-bold uppercase tracking-[0.3em]">Terrestrial Observatory Network</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 size-4 text-purple-400" />
          <input 
            type="text" 
            placeholder="Locate station..."
            className="pl-10 pr-4 py-2 bg-white border border-purple-100 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none w-64"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sites.map((site) => (
          <div key={site.observatory_id} className="bg-white rounded-3xl p-6 border border-purple-50 shadow-sm hover:shadow-xl transition-all flex gap-6">
            <div className="hidden sm:flex flex-col items-center justify-center p-4 bg-slate-900 rounded-2xl text-purple-400">
              <Radio className="size-8" />
              <span className="text-[8px] font-black mt-2 uppercase">Live</span>
            </div>
            
            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">{site.name}</h3>
                <span className="text-[9px] font-bold px-2 py-1 bg-purple-50 text-purple-600 rounded-lg border border-purple-100 uppercase">
                  ID: {site.observatory_id}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-y-3 mt-4">
                <div className="flex items-center gap-2 text-slate-500">
                  <Map className="size-3 text-purple-400" />
                  <span className="text-xs font-bold">Location: {site.location || 'Unknown'}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <Wind className="size-3 text-purple-400" />
                  <span className="text-xs font-bold">Alt: {site.elevation || '0'}m</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <Building className="size-3 text-purple-400" />
                  <span className="text-xs font-bold">Country ID: {site.country_id}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Observatories;