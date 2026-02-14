import React, { useState, useEffect } from 'react';
import API from '../api';
import { Compass, Map, Waypoints, Info } from 'lucide-react';

const CelestialObjects = ({ user }) => {
  const isAdmin = user?.role_id === 1; // Strict check to hide CRUD
  const [objects, setObjects] = useState([]);

  useEffect(() => {
    API.get('/api/celestialobjects').then(res => setObjects(res.data || []));
  }, []);

  return (
    <div className="space-y-6 font-mono">
      <header className="border-b border-slate-200 pb-4">
        <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Scientific Registry</h2>
        <p className="text-[10px] text-purple-500 font-bold uppercase tracking-widest">Sector-specific telemetry data</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {objects.map(obj => (
          <div key={obj.object_id} className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm hover:border-purple-400 transition-all">
            <h3 className="text-lg font-black text-slate-900 uppercase">{obj.name}</h3>
            
            {/* SCIENTIFIC METRICS */}
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase">
                <span>Coordinates:</span>
                <span className="text-slate-900">RA: {obj.right_ascension} / Dec: {obj.declination}</span>
              </div>
              <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase">
                <span>Distance:</span>
                <span className="text-slate-900">{obj.distance_ly || '0.00'} Light Years</span>
              </div>
            </div>

            {/* ONLY ADMINS SEE THIS */}
            {isAdmin && <button className="mt-4 text-xs text-red-500">Delete Record</button>}
          </div>
        ))}
      </div>
    </div>
  );
};