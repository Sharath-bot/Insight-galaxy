import React, { useEffect, useState } from 'react';
import API from '../api';
import { Globe2, Loader2, Plus, Trash2, Edit2, Check, X } from 'lucide-react';

const Countries = () => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // States for CRUD operations
  const [showAddForm, setShowAddForm] = useState(false);
  // NEW: State for both required attributes
  const [newCountry, setNewCountry] = useState({ name: "", iso_code: "" });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ name: "", iso_code: "" });

  const fetchCountries = () => {
    setLoading(true);
    API.get('/api/countries')
      .then(res => {
        setCountries(res.data);
        setLoading(false);
      })
      .catch(err => console.error("Database signal lost:", err));
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  // CREATE: Add new country with both Name and ISO Code
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      // Sending both required VARCHAR fields
      await API.post('/api/countries', newCountry);
      setNewCountry({ name: "", iso_code: "" });
      setShowAddForm(false);
      fetchCountries();
    } catch (err) {
      alert("Error: ISO Code must be unique and exactly 3 characters.");
    }
  };

  // DELETE: Remove country
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to expunge this territory?")) {
      try {
        await API.delete(`/api/countries/${id}`);
        setCountries(countries.filter(c => c.country_id !== id));
      } catch (err) {
        alert("Deletion failed: Nation may be linked to other data.");
      }
    }
  };

  // UPDATE: Finalize changes for both Name and ISO Code
  const handleUpdate = async (id) => {
    try {
      await API.put(`/api/countries/${id}`, editData);
      setEditingId(null);
      fetchCountries();
    } catch (err) {
      alert("Update failed. Check if ISO code is unique.");
    }
  };

  if (loading) return <div className="p-10 text-slate-400 font-mono flex items-center gap-2"><Loader2 className="animate-spin" /> SYNCHRONIZING NATIONS...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-700 font-mono">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Global Territories</h2>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase hover:bg-blue-600 transition-all"
        >
          {showAddForm ? <X size={16}/> : <><Plus size={16} /> Add Nation</>}
        </button>
      </div>

      {/* CREATE FORM WITH MULTIPLE INPUTS */}
      {showAddForm && (
        <form onSubmit={handleAdd} className="bg-emerald-50 p-6 rounded-[2rem] border-2 border-emerald-100 grid grid-cols-1 md:grid-cols-3 gap-4 animate-in slide-in-from-top-4">
          <input 
            className="bg-white border-none rounded-xl px-4 py-2 text-sm outline-none ring-2 ring-emerald-200 focus:ring-emerald-500 transition-all"
            placeholder="Country Name (e.g. India)"
            value={newCountry.name}
            onChange={(e) => setNewCountry({...newCountry, name: e.target.value})}
            required
          />
          <input 
            className="bg-white border-none rounded-xl px-4 py-2 text-sm outline-none ring-2 ring-emerald-200 focus:ring-emerald-500 transition-all"
            placeholder="ISO Code (e.g. IND)"
            maxLength={3}
            value={newCountry.iso_code}
            onChange={(e) => setNewCountry({...newCountry, iso_code: e.target.value})}
            required
          />
          <button type="submit" className="bg-emerald-600 text-white px-6 rounded-xl font-bold uppercase text-[10px] hover:bg-emerald-700 transition-colors">
            Authorize Nation
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {countries.map((country) => (
          <div key={country.country_id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-3">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <Globe2 className="size-5" />
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {editingId === country.country_id ? (
                  <button onClick={() => handleUpdate(country.country_id)} className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-md"><Check size={14}/></button>
                ) : (
                  <button onClick={() => {
                    setEditingId(country.country_id); 
                    setEditData({ name: country.name, iso_code: country.iso_code });
                  }} className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md"><Edit2 size={14}/></button>
                )}
                <button onClick={() => handleDelete(country.country_id)} className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md"><Trash2 size={14}/></button>
              </div>
            </div>

            {editingId === country.country_id ? (
              <div className="space-y-2">
                <input 
                  className="w-full bg-slate-50 border-b border-blue-500 outline-none font-bold text-slate-900 text-sm"
                  value={editData.name}
                  onChange={(e) => setEditData({...editData, name: e.target.value})}
                />
                <input 
                  className="w-full bg-slate-50 border-b border-blue-500 outline-none text-xs text-blue-600 font-black uppercase"
                  maxLength={3}
                  value={editData.iso_code}
                  onChange={(e) => setEditData({...editData, iso_code: e.target.value})}
                />
              </div>
            ) : (
              <>
                <h3 className="font-bold text-slate-900 uppercase text-lg">{country.name}</h3>
                <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest mt-1">
                  ISO: {country.iso_code}
                </p>
              </>
            )}
            
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-4">
              System ID: {country.country_id}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Countries;