import React, { useEffect, useState } from 'react';
import API from '../api';
import { UserCircle, Rocket, Building2, Loader2, Award } from 'lucide-react';

const Astronauts = () => {
  const [astronauts, setAstronauts] = useState([]);
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCorpsData = async () => {
      try {
        // Fetching astronauts and agencies simultaneously
        const [astroRes, agencyRes] = await Promise.all([
          API.get('/api/astronauts'),
          API.get('/api/agencies')
        ]);
        
        setAstronauts(astroRes.data);
        setAgencies(agencyRes.data);
      } catch (err) {
        console.error("Communications blackout: Could not reach the corps registry.", err);
      } finally {
        setLoading(false);
      }
    };
    loadCorpsData();
  }, []);

  // Helper: Match Astronaut to their Agency name
  const getAgencyName = (id) => {
    const found = agencies.find(a => a.agency_id === id);
    return found ? (found.agency_name || found.name) : "Independent Pilot";
  };

  if (loading) return (
    <div className="p-10 text-slate-400 font-mono flex items-center gap-2">
      <Loader2 className="animate-spin size-4" /> RECRUITING PERSONNEL...
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Astronaut Corps</h2>
        <p className="text-slate-400 text-xs font-mono uppercase tracking-widest">Active flight crew and mission specialists</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {astronauts.map((pilot) => (
          <div key={pilot.astronaut_id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-slate-900 text-cyan-400 rounded-2xl group-hover:bg-cyan-500 group-hover:text-black transition-colors">
                <UserCircle className="size-6" />
              </div>
              <div className="text-right">
                <span className="block text-[10px] font-black text-slate-400 uppercase">Flight Hours</span>
                <span className="text-lg font-black text-slate-900">{pilot.flight_hours || '0'}h</span>
              </div>
            </div>

            <h3 className="text-xl font-black text-slate-800 uppercase leading-tight">
              {pilot.name || pilot.full_name || "Unknown Pilot"}
            </h3>
            
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <Building2 className="size-3 text-slate-400" />
                <span>{getAgencyName(pilot.agency_id)}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <Award className="size-3 text-slate-400" />
                <span>Rank: {pilot.rank || "Specialist"}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
              <span className="flex items-center gap-1 text-[9px] font-black text-emerald-500 uppercase tracking-tighter">
                <Rocket className="size-3" /> Status: Flight Ready
              </span>
              <button className="text-[9px] font-black text-slate-400 hover:text-blue-600 uppercase tracking-widest transition-colors">
                View Log
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Astronauts;