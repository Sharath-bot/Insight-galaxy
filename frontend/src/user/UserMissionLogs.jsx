import React, { useEffect, useState } from 'react';
import API from '../api';
import { Rocket, Clock, ShieldCheck, Loader2 } from 'lucide-react';

const UserMissionLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch missions from the universal API
    API.get('/api/missions')
      .then(res => {
        setLogs(res.data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  if (loading) return <div className="p-10 text-emerald-500 font-mono flex items-center gap-2"><Loader2 className="animate-spin" /> SYNCING LOGS...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Mission Logs</h2>
      
      <div className="grid gap-4">
        {logs.map((mission) => (
          <div key={mission.mission_id} className="bg-slate-900/50 border border-emerald-900/20 p-6 rounded-3xl flex justify-between items-center group hover:border-emerald-500/50 transition-all">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl">
                <Rocket className="size-5" />
              </div>
              <div>
                <h4 className="font-bold text-white uppercase text-sm">{mission.mission_name}</h4>
                <p className="text-[10px] text-slate-500 font-mono mt-1">
                  Launch Date: {mission.launch_date || 'TBD'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-right">
                <span className="block text-[9px] font-black text-emerald-500 uppercase tracking-widest">Status</span>
                <span className="text-xs text-white font-bold">{mission.status || 'In Transit'}</span>
              </div>
              <button className="p-2 bg-slate-800 text-slate-400 rounded-xl hover:text-emerald-400 transition-colors">
                <ShieldCheck size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserMissionLogs;