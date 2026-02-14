import React, { useEffect, useState } from 'react';
import API from '../api';
import { Building2, ExternalLink, Loader2, MapPin, Plus, Trash2, Edit2, Check, X } from 'lucide-react';

const Agencies = () => {
  const [agencies, setAgencies] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);

  // CRUD States - Updated to match your exact SQL attributes
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAgency, setNewAgency] = useState({ 
    name: "", 
    abbreviation: "", 
    country_id: "", 
    founded_year: "", 
    website: "" 
  });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const loadData = async () => {
    setLoading(true);
    try {
      const [agenciesRes, countriesRes] = await Promise.all([
        API.get('/api/agencies'),
        API.get('/api/countries')
      ]);
      setAgencies(agenciesRes.data);
      setCountries(countriesRes.data);
    } catch (err) {
      console.error("Data retrieval mission failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  // --- CRUD FUNCTIONS ---
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await API.post('/api/agencies', newAgency);
      setNewAgency({ name: "", abbreviation: "", country_id: "", founded_year: "", website: "" });
      setShowAddForm(false);
      loadData();
    } catch (err) { alert("Error: Name must be unique and Country ID valid."); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Decommission this agency?")) {
      try {
        await API.delete(`/api/agencies/${id}`);
        setAgencies(agencies.filter(a => a.agency_id !== id));
      } catch (err) { alert("Deletion blocked: Records linked to missions."); }
    }
  };

  const handleUpdate = async (id) => {
    try {
      await API.put(`/api/agencies/${id}`, editData);
      setEditingId(null);
      loadData();
    } catch (err) { alert("Update failed."); }
  };

  const getCountryName = (id) => {
    const found = countries.find(c => c.country_id === id);
    return found ? found.name : "International Sector";
  };

  if (loading) return <div className="p-10 text-slate-400 font-mono flex items-center gap-2"><Loader2 className="animate-spin" /> SYNCHRONIZING DATABASE...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-700 font-mono">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Strategic Agencies</h2>
        <button onClick={() => setShowAddForm(!showAddForm)} className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase hover:bg-blue-600 transition-all">
          {showAddForm ? <X size={16}/> : <><Plus size={16} /> Add Agency</>}
        </button>
      </div>

      {/* CREATE FORM */}
      {showAddForm && (
        <form onSubmit={handleAdd} className="bg-blue-50 p-6 rounded-[2rem] border-2 border-blue-100 grid grid-cols-1 md:grid-cols-3 gap-4 animate-in slide-in-from-top-4">
          <input className="bg-white rounded-xl px-4 py-2 text-sm outline-none" placeholder="Full Name (e.g. NASA)" required value={newAgency.name} onChange={(e) => setNewAgency({...newAgency, name: e.target.value})} />
          <input className="bg-white rounded-xl px-4 py-2 text-sm outline-none" placeholder="Abbreviation (e.g. NASA)" value={newAgency.abbreviation} onChange={(e) => setNewAgency({...newAgency, abbreviation: e.target.value})} />
          <select className="bg-white rounded-xl px-4 py-2 text-sm outline-none" required value={newAgency.country_id} onChange={(e) => setNewAgency({...newAgency, country_id: e.target.value})}>
            <option value="">Select Jurisdiction</option>
            {countries.map(c => <option key={c.country_id} value={c.country_id}>{c.name}</option>)}
          </select>
          <input className="bg-white rounded-xl px-4 py-2 text-sm outline-none" placeholder="Founded Year" value={newAgency.founded_year} onChange={(e) => setNewAgency({...newAgency, founded_year: e.target.value})} />
          <input className="bg-white rounded-xl px-4 py-2 text-sm outline-none" placeholder="Website URL" value={newAgency.website} onChange={(e) => setNewAgency({...newAgency, website: e.target.value})} />
          <button type="submit" className="bg-blue-600 text-white px-6 rounded-xl font-bold uppercase text-[10px]">Authorize</button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agencies.map((agency) => (
          <div key={agency.agency_id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-blue-300 transition-all flex flex-col justify-between group">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><Building2 className="size-6" /></div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {editingId === agency.agency_id ? (
                    <button onClick={() => handleUpdate(agency.agency_id)} className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-md"><Check size={14}/></button>
                  ) : (
                    <button onClick={() => { setEditingId(agency.agency_id); setEditData(agency); }} className="p-1 text-slate-400 hover:text-blue-600 rounded-md"><Edit2 size={14}/></button>
                  )}
                  <button onClick={() => handleDelete(agency.agency_id)} className="p-1 text-slate-400 hover:text-red-600 rounded-md"><Trash2 size={14}/></button>
                </div>
              </div>

              {editingId === agency.agency_id ? (
                <div className="space-y-3">
                  <input className="w-full bg-slate-50 border-b border-blue-500 text-sm font-bold p-1 outline-none" value={editData.name} onChange={(e) => setEditData({...editData, name: e.target.value})} />
                  <input className="w-full bg-slate-50 border-b border-blue-500 text-xs p-1 outline-none" value={editData.website} onChange={(e) => setEditData({...editData, website: e.target.value})} />
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-xl font-black text-slate-800 uppercase leading-tight">
                      {agency.name}
                    </h3>
                    <span className="text-[10px] font-bold text-slate-400">{agency.abbreviation}</span>
                  </div>
                  <div className="flex flex-col gap-1 mt-3">
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Est. {agency.founded_year}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase">Jurisdiction: {getCountryName(agency.country_id)}</p>
                  </div>
                </>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-50">
              {agency.website ? (
                <a href={agency.website} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-2 bg-slate-900 text-white text-[10px] font-bold uppercase rounded-xl hover:bg-blue-600 transition-colors">
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