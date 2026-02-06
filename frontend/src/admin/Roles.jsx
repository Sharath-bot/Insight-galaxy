import React, { useEffect, useState } from 'react';
import API from '../api';
import { Shield, Key, CheckCircle } from 'lucide-react';

const Roles = () => {
  const [roles, setRoles] = useState([
    { role_id: 1, role_name: 'Admin', description: 'Full system override and personnel management.' },
    { role_id: 2, role_name: 'Researcher', description: 'Access to celestial registries and observation logs.' },
    { role_id: 3, role_name: 'Explorer', description: 'Standard access to the galactic database.' }
  ]);

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div>
        <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Access Control Protocol</h2>
        <p className="text-slate-400 text-xs font-mono uppercase tracking-[0.2em]">Managing clearance levels for Insight Galaxy</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {roles.map((role) => (
          <div key={role.role_id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-50 rounded-2xl group-hover:bg-blue-600 transition-colors">
                <Shield className="size-6 text-blue-600 group-hover:text-white" />
              </div>
              <span className="text-[10px] font-black px-2 py-1 bg-slate-100 text-slate-500 rounded uppercase">
                ID: {role.role_id}
              </span>
            </div>
            
            <h3 className="text-xl font-black text-slate-800 uppercase mb-1">{role.role_name}</h3>
            <p className="text-xs text-slate-500 mb-4">{role.description}</p>
            
            <div className="pt-4 border-t border-slate-50 flex items-center gap-2 text-[10px] font-bold text-emerald-500 uppercase">
              <CheckCircle className="size-3" /> System Active
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 text-cyan-400 p-4 rounded-xl font-mono text-[10px] border border-cyan-500/20">
        <p> SECURITY_LOG: Clearance levels are synchronized with the central MySQL node.</p>
        <p>STATUS: Encryption modules active.</p>
      </div>
    </div>
  );
};

export default Roles;