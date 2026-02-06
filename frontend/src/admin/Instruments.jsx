import React, { useEffect, useState } from 'react';
import API from '../api';
import { Microscope, Cpu, Loader2 } from 'lucide-react';

const Instruments = () => {
  const [tools, setTools] = useState([]);

  useEffect(() => {
    API.get('/api/instruments').then(res => setTools(res.data));
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Scientific Instruments</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tools.map(tool => (
          <div key={tool.instrument_id} className="bg-white p-6 rounded-3xl border border-slate-200 flex flex-col items-center text-center">
            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-full mb-4">
              <Microscope size={32} />
            </div>
            <h3 className="font-bold text-slate-900 uppercase text-sm">{tool.name}</h3>
            <span className="mt-2 px-2 py-1 bg-slate-100 text-[9px] font-black text-slate-500 rounded uppercase">
              {tool.type || 'Sensor Array'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Instruments;