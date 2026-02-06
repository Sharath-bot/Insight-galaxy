import React, { useEffect, useState } from 'react';
import API from '../api';
import { Star, Calendar, MapPin, Search, Award } from 'lucide-react';

const Discoveries = () => {
  const [discoveries, setDiscoveries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchDiscoveries = async () => {
      try {
        const res = await API.get('/api/discoveries');
        setDiscoveries(res.data);
      } catch (err) {
        console.error("Data loss: Could not sync discovery logs.");
      }
    };
    fetchDiscoveries();
  }, []);

  const filtered = discoveries.filter(d => 
    d.discovery_type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-purple-900 uppercase">Scientific Discoveries</h2>
          <p className="text-purple-400 text-[10px] font-bold uppercase tracking-[0.3em]">Official Research Breakthroughs</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 size-4 text-purple-400" />
          <input 
            type="text" 
            placeholder="Filter by discovery type..."
            className="pl-10 pr-4 py-2 bg-white border border-purple-100 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((d) => (
          <div key={d.discovery_id} className="bg-white p-6 rounded-3xl border border-purple-50 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
               <Award className="size-16 text-purple-900" />
            </div>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-amber-50 rounded-lg">
                <Star className="size-5 text-amber-500 fill-amber-500" />
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Discovery ID: {d.discovery_id}</span>
            </div>

            <h3 className="text-lg font-black text-slate-800 uppercase mb-2">{d.discovery_type || 'New Body'}</h3>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-500 font-bold uppercase">
                <Calendar className="size-3" /> Date: {d.discovery_date}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 font-bold uppercase">
                <MapPin className="size-3" /> Object ID: {d.object_id}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Discoveries;