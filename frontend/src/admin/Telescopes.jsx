import React, { useEffect, useState } from 'react';
import API from '../api';
import { Search, Info, Loader2, Maximize } from 'lucide-react';

const Telescopes = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/api/telescopes').then(res => {
      setList(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-10 text-slate-400 font-mono"><Loader2 className="animate-spin inline mr-2"/> ALIGNING LENSES...</div>;

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Aperture Inventory</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {list.map(t => (
          <div key={t.telescope_id} className="bg-slate-900 p-6 rounded-3xl border border-slate-800 text-white flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-cyan-400 uppercase tracking-tight">{t.name}</h3>
              <p className="text-[10px] text-slate-500 uppercase font-mono mt-1">Aperture: {t.aperture_m} Meters</p>
            </div>
            <div className="p-3 bg-white/5 rounded-2xl">
              <Search className="size-6 text-slate-400" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Telescopes;