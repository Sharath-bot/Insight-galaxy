import React, { useState, useEffect } from 'react';
import API from '../api';
import { Users, Trash2, UserCheck, Loader2 } from 'lucide-react';

const Astronauts = ({ user }) => {
  // Guard: Only Role 1 (Admin) has write access
  const isAdmin = user?.role_id === 1;
  const [crew, setCrew] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/api/astronauts')
      .then(res => setCrew(res.data || []))
      .catch(err => console.error("Telemetry failure", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-10 font-mono text-indigo-600 animate-pulse">SCANNING CREW MANIFEST...</div>;

  return (
    <div className="space-y-6 font-mono">
      <div className="flex justify-between items-center border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter text-indigo-900">Astronaut Registry</h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Active Personnel Manifest</p>
        </div>
        {/* UI GUARD: Hidden for Researchers */}
        {isAdmin && (
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase shadow-lg">
            Enlist Personnel
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {crew.map(member => (
          <div key={member.astronaut_id} className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm group hover:shadow-xl transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <UserCheck size={20} />
              </div>
              {/* ACTION GUARD: Hidden for Researchers */}
              {isAdmin && (
                <button className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:bg-red-50 rounded-lg transition-all">
                  <Trash2 size={16} />
                </button>
              )}
            </div>
            <h3 className="text-lg font-black text-slate-900 uppercase">{member.name}</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Spec: {member.specialization || 'Flight Engineer'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Astronauts;