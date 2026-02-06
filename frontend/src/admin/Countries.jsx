import React, { useEffect, useState } from 'react';
import API from '../api';
import { Globe2, Loader2, MapPin } from 'lucide-react';

const Countries = () => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/api/countries')
      .then(res => {
        setCountries(res.data);
        setLoading(false);
      })
      .catch(err => console.error("Database signal lost:", err));
  }, []);

  if (loading) return <div className="p-10 text-slate-400 font-mono flex items-center gap-2"><Loader2 className="animate-spin" /> SYNCHRONIZING NATIONS...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Global Territories</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {countries.map((country) => (
          <div key={country.country_id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg w-fit mb-3">
              <Globe2 className="size-5" />
            </div>
            {/* Make sure these names match your SQL column names exactly */}
            <h3 className="font-bold text-slate-900 uppercase text-lg">{country.name}</h3>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">
             
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Countries;