import React, { useEffect, useState } from 'react';
import API from '../api';
import { Building2, Globe2, Briefcase, Info } from 'lucide-react';

const Agencies = () => {
  const [agencies, setAgencies] = useState([]);

  useEffect(() => {
    const fetchAgencies = async () => {
      try {
        const res = await API.get('/api/agencies');
        setAgencies(res.data);
      } catch (err) {
        console.error("Diplomatic failure: Agency data unreachable.");
      }
    };
    fetchAgencies();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <h2 className="text-2xl font-black text-purple-900 uppercase">Space Agencies</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {agencies.map((agency) => (
          <div key={agency.agency_id} className="bg-white p-6 rounded-3xl border border-purple-50 shadow-sm flex items-center gap-6">
            <div className="p-5 bg-purple-900 text-white rounded-2xl">
              <Building2 className="size-8" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-black text-slate-800 uppercase">{agency.name}</h3>
              <div className="flex gap-4 mt-2">
                <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase">
                  <Globe2 className="size-3" /> Country ID: {agency.country_id}
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase">
                  <Briefcase className="size-3" /> ID: {agency.agency_id}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Agencies;