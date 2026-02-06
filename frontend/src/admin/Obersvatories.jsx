import React, { useEffect, useState } from 'react';
import API from '../api';
import { Radio, MapPin, Loader2, Globe } from 'lucide-react';

const Observatories = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/api/observatories')
      .then(res => { setData(res.data); setLoading(false); })
      .catch(err => console.error("Comms Link Failure:", err));
  }, []);

  if (loading) return <div className="p-10 text-slate-400 font-mono flex items-center gap-2"><Loader2 className="animate-spin" /> SCANNING FREQUENCIES...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Deep Space Observatories</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data.map(obs => (
          <div key={obs.observatory_id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition-all">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl w-fit mb-4">
              <Radio className="size-6" />
            </div>
            <h3 className="font-bold text-slate-900 uppercase">{obs.name}</h3>
            <div className="mt-3 space-y-1">
              <p className="text-xs text-slate-500 flex items-center gap-1"><MapPin size={12}/> {obs.location}</p>
              <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Type: {obs.type || 'Research Station'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Observatories;