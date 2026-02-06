import React, { useEffect, useState } from 'react';
import API from '../api';
import { UserCircle, GraduationCap, Award, Briefcase, Search } from 'lucide-react';

const Astronauts = () => {
  const [astronauts, setAstronauts] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchAstronauts = async () => {
      try {
        // GET request to the astronauts table
        const res = await API.get('/api/astronauts');
        setAstronauts(res.data);
      } catch (err) {
        console.error("Communication failure: Unable to sync astronaut registry.");
      }
    };
    fetchAstronauts();
  }, []);

  const filteredAstronauts = astronauts.filter(a => 
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.specialization?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-purple-900 uppercase">Astronaut Corps</h2>
          <p className="text-purple-400 text-[10px] font-bold uppercase tracking-[0.3em]">Qualified Personnel & Flight Logs</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 size-4 text-purple-400" />
          <input 
            type="text" 
            placeholder="Search by name or specialty..."
            className="pl-10 pr-4 py-2 bg-white border border-purple-100 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none w-64"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAstronauts.map((astronaut) => (
          <div key={astronaut.astronaut_id} className="bg-white rounded-3xl p-6 border border-purple-50 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-slate-900 rounded-2xl">
                <UserCircle className="size-8 text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">{astronaut.name}</h3>
                <span className="text-[10px] font-bold text-purple-500 uppercase tracking-widest bg-purple-50 px-2 py-0.5 rounded">
                  {astronaut.rank || 'Active Duty'}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-slate-600">
                <GraduationCap className="size-4 text-slate-400" />
                <span className="text-xs font-medium">{astronaut.specialization || 'General Pilot'}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <Briefcase className="size-4 text-slate-400" />
                <span className="text-xs font-medium">Agency ID: {astronaut.agency_id}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <Award className="size-4 text-slate-400" />
                <span className="text-xs font-medium">{astronaut.total_flight_hours || 0} Flight Hours</span>
              </div>
            </div>

            <button className="w-full mt-6 py-3 bg-slate-50 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-purple-600 hover:text-white transition-all">
              View Detailed Profile
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Astronauts;