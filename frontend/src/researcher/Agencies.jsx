import React, { useState, useEffect } from 'react';
import API from '../api';
import { Building2, Plus, Trash2, MapPin } from 'lucide-react';

const Agencies = ({ user }) => {
  // 1. DEFINE GUARD: Only Admin (Role 1) has write access
  const isAdmin = user?.role_id === 1;
  const [agencies, setAgencies] = useState([]);

  useEffect(() => {
    API.get('/api/agencies').then(res => setAgencies(res.data || []));
  }, []);

  return (
    <div className="space-y-6 font-mono">
      <div className="flex justify-between items-center border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Space Agencies</h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Global Organizational Registry</p>
        </div>
        {/* 2. UI GUARD: Hide 'Add' button for Researchers */}
        {isAdmin && (
          <button className="bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase">
            Add Agency
          </button>
        )}
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase">
            <tr>
              <th className="p-4">Agency Name</th>
              <th className="p-4">Location ID</th>
              {isAdmin && <th className="p-4 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {agencies.map(agency => (
              <tr key={agency.agency_id} className="hover:bg-slate-50 group">
                <td className="p-4 font-bold text-slate-900 flex items-center gap-2">
                  <Building2 size={14} className="text-blue-500" /> {agency.name}
                </td>
                <td className="p-4 text-slate-500">
                   <div className="flex items-center gap-1"><MapPin size={12}/> {agency.country_id}</div>
                </td>
                {/* 3. UI GUARD: Hide 'Delete' button for Researchers */}
                {isAdmin && (
                  <td className="p-4 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                      <Trash2 size={14} />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Agencies;