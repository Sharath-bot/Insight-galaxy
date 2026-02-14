import React, { useEffect, useState } from 'react';
import API from '../api';
import { UserCircle, Rocket, Building2, Loader2, Globe, Calendar, Plus, Trash2, Edit2, Check, X } from 'lucide-react';

const Astronauts = () => {
  const [astronauts, setAstronauts] = useState([]);
  const [agencies, setAgencies] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);

  // CRUD States
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAstro, setNewAstro] = useState({ 
    full_name: "", country_id: "", date_of_birth: "", agency_id: "" 
  });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const loadCorpsData = async () => {
    setLoading(true);
    try {
      // Fetching all required relational data
      const [astroRes, agencyRes, countryRes] = await Promise.all([
        API.get('/api/astronauts'),
        API.get('/api/agencies'),
        API.get('/api/countries')
      ]);
      
      setAstronauts(astroRes.data);
      setAgencies(agencyRes.data);
      setCountries(countryRes.data);
    } catch (err) {
      console.error("Communications blackout:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCorpsData(); }, []);

  // --- CRUD FUNCTIONS ---

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await API.post('/api/astronauts', newAstro);
      setNewAstro({ full_name: "", country_id: "", date_of_birth: "", agency_id: "" });
      setShowAddForm(false);
      loadCorpsData();
    } catch (err) { 
      alert("Error adding personnel. Ensure Name and Country are provided."); 
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Authorize permanent removal of this personnel record?")) {
      try {
        await API.delete(`/api/astronauts/${id}`);
        setAstronauts(astronauts.filter(a => a.astronaut_id !== id));
      } catch (err) { 
        alert("Deletion failed: Personnel may be assigned to active missions."); 
      }
    }
  };

  const handleUpdate = async (id) => {
    try {
      // Data Cleaning: Ensure IDs are numbers and Date is YYYY-MM-DD
      const payload = { 
        ...editData,
        country_id: Number(editData.country_id),
        agency_id: editData.agency_id ? Number(editData.agency_id) : null
      };

      if (payload.date_of_birth) {
        payload.date_of_birth = new Date(payload.date_of_birth).toISOString().split('T')[0];
      }

      await API.put(`/api/astronauts/${id}`, payload);
      setEditingId(null);
      loadCorpsData();
    } catch (err) { 
      console.error(err);
      alert("Update failed: Check relational constraints in database."); 
    }
  };

  // Helper functions with numeric comparison
  const getAgencyName = (id) => {
    const found = agencies.find(a => Number(a.agency_id) === Number(id));
    return found ? (found.name || found.agency_name) : "Independent";
  };

  const getCountryName = (id) => {
    const found = countries.find(c => Number(c.country_id) === Number(id));
    return found ? found.name : "Unknown Territory";
  };

  if (loading) return (
    <div className="p-10 text-slate-400 font-mono flex items-center gap-2">
      <Loader2 className="animate-spin size-4" /> RECRUITING PERSONNEL...
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-700 font-mono">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Astronaut Corps</h2>
          <p className="text-slate-400 text-xs uppercase tracking-widest">Active flight crew and mission specialists</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase hover:bg-blue-600 transition-all"
        >
          {showAddForm ? <X size={16}/> : <><Plus size={16} /> Enlist Personnel</>}
        </button>
      </div>

      {/* CREATE FORM */}
      {showAddForm && (
        <form onSubmit={handleAdd} className="bg-slate-50 p-6 rounded-[2rem] border-2 border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-top-4">
          <input className="bg-white rounded-xl px-4 py-2 text-sm outline-none border border-slate-200"
            placeholder="Full Name" required value={newAstro.full_name}
            onChange={(e) => setNewAstro({...newAstro, full_name: e.target.value})} />
          
          <input className="bg-white rounded-xl px-4 py-2 text-sm outline-none border border-slate-200"
            type="date" required value={newAstro.date_of_birth}
            onChange={(e) => setNewAstro({...newAstro, date_of_birth: e.target.value})} />

          <select className="bg-white rounded-xl px-4 py-2 text-sm outline-none border border-slate-200"
            required value={newAstro.country_id} onChange={(e) => setNewAstro({...newAstro, country_id: e.target.value})}>
            <option value="">Select Home Country</option>
            {countries.map(c => <option key={c.country_id} value={c.country_id}>{c.name}</option>)}
          </select>

          <select className="bg-white rounded-xl px-4 py-2 text-sm outline-none border border-slate-200"
            value={newAstro.agency_id} onChange={(e) => setNewAstro({...newAstro, agency_id: e.target.value})}>
            <option value="">Select Agency Assignment</option>
            {agencies.map(a => <option key={a.agency_id} value={a.agency_id}>{a.name}</option>)}
          </select>

          <button type="submit" className="md:col-span-2 bg-blue-600 text-white py-2 rounded-xl font-bold uppercase text-[10px] hover:bg-blue-700">
            Authorize Commission
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {astronauts.map((pilot) => (
          <div key={pilot.astronaut_id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-slate-900 text-cyan-400 rounded-2xl group-hover:bg-blue-600 transition-colors">
                <UserCircle className="size-6" />
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {editingId === pilot.astronaut_id ? (
                  <button onClick={() => handleUpdate(pilot.astronaut_id)} className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-md"><Check size={14}/></button>
                ) : (
                  <button onClick={() => { setEditingId(pilot.astronaut_id); setEditData({...pilot}); }} className="p-1 text-slate-400 hover:text-blue-600 rounded-md"><Edit2 size={14}/></button>
                )}
                <button onClick={() => handleDelete(pilot.astronaut_id)} className="p-1 text-slate-400 hover:text-red-600 rounded-md"><Trash2 size={14}/></button>
              </div>
            </div>

            {editingId === pilot.astronaut_id ? (
              <div className="space-y-3 animate-in fade-in">
                <input className="w-full bg-slate-50 border-b-2 border-blue-500 text-sm font-bold p-1 outline-none"
                  value={editData.full_name} onChange={(e) => setEditData({...editData, full_name: e.target.value})} />
                
                <select className="w-full bg-slate-50 border-b border-blue-500 text-[10px] p-1 outline-none"
                  value={editData.agency_id} onChange={(e) => setEditData({...editData, agency_id: e.target.value})}>
                  {agencies.map(a => <option key={a.agency_id} value={a.agency_id}>{a.name}</option>)}
                </select>

                <select className="w-full bg-slate-50 border-b border-blue-500 text-[10px] p-1 outline-none"
                  value={editData.country_id} onChange={(e) => setEditData({...editData, country_id: e.target.value})}>
                  {countries.map(c => <option key={c.country_id} value={c.country_id}>{c.name}</option>)}
                </select>

                <input type="date" className="w-full bg-slate-50 border-b border-blue-500 text-[10px] p-1 outline-none"
                  value={editData.date_of_birth ? editData.date_of_birth.split('T')[0] : ""} 
                  onChange={(e) => setEditData({...editData, date_of_birth: e.target.value})} />
              </div>
            ) : (
              <>
                <h3 className="text-xl font-black text-slate-800 uppercase leading-tight">{pilot.full_name}</h3>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <Building2 className="size-3 text-slate-400" />
                    <span>{getAgencyName(pilot.agency_id)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <Globe className="size-3 text-slate-400" />
                    <span>Origin: {getCountryName(pilot.country_id)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <Calendar className="size-3 text-slate-400" />
                    <span>DOB: {pilot.date_of_birth ? new Date(pilot.date_of_birth).toLocaleDateString() : 'N/A'}</span>
                  </div>
                </div>
              </>
            )}

            <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
              <span className="flex items-center gap-1 text-[9px] font-black text-emerald-500 uppercase tracking-tighter">
                <Rocket className="size-3" /> Status: Flight Ready
              </span>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                ID: {pilot.astronaut_id}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Astronauts;