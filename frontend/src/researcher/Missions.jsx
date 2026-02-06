import React, { useEffect, useState } from 'react';
import API from '../api';
import { Rocket, Calendar, MapPin, CheckCircle2, Clock, Plus } from 'lucide-react';

const Missions = () => {
  const [missions, setMissions] = useState([]);

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        // GET request to the missions table
        const res = await API.get('/api/missions');
        setMissions(res.data);
      } catch (err) {
        console.error("Communication blackout: Could not fetch mission data.");
      }
    };
    fetchMissions();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-purple-900 uppercase">Mission Control</h2>
          <p className="text-purple-400 text-[10px] font-bold uppercase tracking-[0.3em]">Operational Status & Deployments</p>
        </div>
        <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all">
          <Plus className="size-4" /> New Mission
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {missions.map((mission) => (
          <div key={mission.mission_id} className="bg-white border border-purple-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className={`p-4 rounded-2xl ${mission.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-purple-50 text-purple-600'}`}>
                <Rocket className="size-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-800 uppercase leading-tight">{mission.mission_name}</h3>
                <div className="flex items-center gap-3 mt-1">
                   <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                     <Calendar className="size-3" /> {mission.launch_date}
                   </span>
                   <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                     <MapPin className="size-3" /> Orbit: {mission.destination || 'LEO'}
                   </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-8">
              <div className="hidden lg:block text-right">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Spacecraft ID</p>
                <p className="text-sm font-bold text-slate-700">{mission.spacecraft_id || 'N/A'}</p>
              </div>

              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-100">
                {mission.status === 'Completed' ? (
                  <CheckCircle2 className="size-4 text-emerald-500" />
                ) : (
                  <Clock className="size-4 text-amber-500 animate-pulse" />
                )}
                <span className={`text-[10px] font-black uppercase ${mission.status === 'Completed' ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {mission.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Missions;