import React, { useEffect, useState } from 'react';
import API from '../api';
import { Building2, ExternalLink, Loader2, MapPin } from 'lucide-react';

const Agencies = () => {
  const [agencies, setAgencies] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetching both agencies and countries simultaneously for the lookup
        const [agenciesRes, countriesRes] = await Promise.all([
          API.get('/api/agencies'),
          API.get('/api/countries')
        ]);
        
        console.log("Agency Data Sample:", agenciesRes.data[0]); // Check keys in Console
        setAgencies(agenciesRes.data);
        setCountries(countriesRes.data);
      } catch (err) {
        console.error("Data retrieval mission failed:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Helper function to find country name by ID or Code
  const getCountryName = (id) => {
    const found = countries.find(c => c.country_id === id || c.country_code === id);
    return found ? found.country_name : "International Sector";
  };

  if (loading) return (
    <div className="p-10 text-slate-400 font-mono flex items-center gap-2">
      <Loader2 className="animate-spin" /> ACCESSING AGENCY DATABASE...
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Strategic Agencies</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agencies.map((agency) => (
          <div key={agency.agency_id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-blue-300 transition-all flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                  <Building2 className="size-6" />
                </div>
                <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-1 rounded">
                  EST. {agency.founded_year || 'N/A'}
                </span>
              </div>

              {/* Fix: Added fallback logic for name and headquarters */}
              <h3 className="text-xl font-black text-slate-800 uppercase leading-tight">
                {agency.agency_name || agency.name || "Unknown Agency"}
              </h3>
              
              <div className="flex flex-col gap-1 mt-3">
                <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                  <MapPin className="size-3" /> {agency.headquarters || "Global Ops"}
                </p>
                {/* Country Lookup Display */}
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
                  Jurisdiction: {getCountryName(agency.country_id || agency.country_code)}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-50">
              {/* Check if your DB uses .website or .website_url */}
              {(agency.website || agency.website_url) ? (
                <a 
                  href={agency.website || agency.website_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-blue-600 transition-colors"
                >
                  Visit Station <ExternalLink className="size-3" />
                </a>
              ) : (
                <span className="text-[10px] text-slate-300 italic text-center block">No URL on file</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Agencies;