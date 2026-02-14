import React, { useState, useEffect } from 'react';
import API from '../api';
import { 
  Search, Plus, Trash2, Edit2, Check, X, 
  Loader2, Building2, Ruler, Calendar, Waves 
} from 'lucide-react';

const Telescopes = ({ user }) => {
  const [data, setData] = useState([]);
  const [observatories, setObservatories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  // Role-based access control
  const isAdmin = user?.role_id === 1;

  // State aligned with SQL schema
  const [newTelescope, setNewTelescope] = useState({
    name: '', observatory_id: '', aperture_m: '', 
    wavelength_range: '', operational_since: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const fetchData = async () => {
    setLoading(true);
    try {
      const [teleRes, obsRes] = await Promise.all([
        API.get('/api/telescopes'),
        API.get('/api/observatories')
      ]);
      setData(Array.isArray(teleRes.data) ? teleRes.data : []);
      setObservatories(obsRes.data || []);
    } catch (err) {
      console.error("Optics Link Failure:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // CREATE: POST functionality
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newTelescope,
        observatory_id: Number(newTelescope.observatory_id),
        aperture_m: Number(newTelescope.aperture_m),
        operational_since: Number(newTelescope.operational_since)
      };
      await API.post('/api/telescopes', payload);
      setShowForm(false);
      setNewTelescope({ name: '', observatory_id: '', aperture_m: '', wavelength_range: '', operational_since: '' });
      fetchData();
    } catch (err) { alert("Registration failed. Check foreign key constraints."); }
  };

  // UPDATE: PUT functionality
  const handleUpdate = async (id) => {
    try {
      const payload = {
        ...editData,
        observatory_id: Number(editData.observatory_id),
        aperture_m: Number(editData.aperture_m),
        operational_since: Number(editData.operational_since)
      };
      await API.put(`/api/telescopes/${id}`, payload);
      setEditingId(null);
      fetchData();
    } catch (err) { alert("Update rejected by server."); }
  };

  // DELETE: DELETE functionality
  const handleDelete = async (id) => {
    if (window.confirm("Confirm permanent decommissioning of this instrument?")) {
      try {
        await API.delete(`/api/telescopes/${id}`);
        fetchData();
      } catch (err) { alert("Action blocked: Linked observation records exist."); }
    }
  };

  const getObsName = (id) => observatories.find(o => Number(o.observatory_id) === Number(id))?.name || "Independent Orbit";

  if (loading) return <div className="p-10 text-slate-400 font-mono flex items-center gap-2"><Loader2 className="animate-spin" /> ALIGNING MIRRORS...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-700 font-mono">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Telescope Registry</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Instrumental Attribute Management</p>
        </div>
        {isAdmin && (
          <button onClick={() => setShowForm(!showForm)} className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase shadow-lg hover:bg-blue-600 transition-all">
            {showForm ? <X size={16}/> : <><Plus size={16}/> New Instrument</>}
          </button>
        )}
      </div>

      {/* CREATE FORM */}
      {showForm && isAdmin && (
        <form onSubmit={handleCreate} className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-top-8">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-blue-400 uppercase ml-2">Name</label>
            <input required className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-sm outline-none" value={newTelescope.name} onChange={e => setNewTelescope({...newTelescope, name: e.target.value})}/>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-blue-400 uppercase ml-2">Host Observatory</label>
            <select required className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-sm outline-none" onChange={e => setNewTelescope({...newTelescope, observatory_id: e.target.value})}>
              <option value="">Select Host</option>
              {observatories.map(o => <option key={o.observatory_id} value={o.observatory_id} className="bg-slate-900">{o.name}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-blue-400 uppercase ml-2">Aperture (m)</label>
            <input type="number" step="0.01" className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-sm outline-none" onChange={e => setNewTelescope({...newTelescope, aperture_m: e.target.value})}/>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-blue-400 uppercase ml-2">Wavelength Range</label>
            <input placeholder="e.g. Optical, Radio" className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-sm outline-none" onChange={e => setNewTelescope({...newTelescope, wavelength_range: e.target.value})}/>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-blue-400 uppercase ml-2">Operational Since (Year)</label>
            <input type="number" placeholder="YYYY" className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-sm outline-none" onChange={e => setNewTelescope({...newTelescope, operational_since: e.target.value})}/>
          </div>
          <button type="submit" className="lg:col-span-3 bg-blue-600 p-4 rounded-2xl font-black uppercase text-xs hover:bg-blue-500 transition-colors">Authorize Deployment</button>
        </form>
      )}

      {/* DISPLAY GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 pb-20">
        {data.map(tele => (
          <div key={tele.telescope_id} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all relative group overflow-hidden">
            <div className="flex justify-between items-start mb-6">
              <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
                <Search size={24} />
              </div>
              {isAdmin && (
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                  {editingId === tele.telescope_id ? (
                    <button onClick={() => handleUpdate(tele.telescope_id)} className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Check size={14}/></button>
                  ) : (
                    <button onClick={() => { setEditingId(tele.telescope_id); setEditData({...tele}); }} className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-blue-600 hover:text-white"><Edit2 size={14}/></button>
                  )}
                  <button onClick={() => handleDelete(tele.telescope_id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white"><Trash2 size={14}/></button>
                </div>
              )}
            </div>

            {/* Editable Title */}
            {editingId === tele.telescope_id ? (
              <input className="text-xl font-black uppercase bg-slate-50 border-b-2 border-blue-500 w-full outline-none p-1" value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})}/>
            ) : (
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight truncate">{tele.name}</h3>
            )}
            
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="bg-slate-50 p-3 rounded-xl flex items-center gap-2">
                <Building2 size={12} className="text-slate-400" />
                <div>
                   <p className="text-[7px] font-black text-slate-400 uppercase">Facility</p>
                   <p className="text-[9px] font-bold text-slate-700 truncate">{getObsName(tele.observatory_id)}</p>
                </div>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl flex items-center gap-2">
                <Ruler size={12} className="text-slate-400" />
                <div>
                   <p className="text-[7px] font-black text-slate-400 uppercase">Aperture</p>
                   <p className="text-[9px] font-bold text-slate-700">{tele.aperture_m || '0.0'}m</p>
                </div>
              </div>
            </div>

            {/* Print all SQL attributes */}
            <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between text-[9px] font-bold">
                <div className="flex items-center gap-2 text-blue-500">
                   <Waves size={12}/>
                   <span className="uppercase">{tele.wavelength_range || 'Visible Spectrum'}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                   <Calendar size={12}/>
                   <span>Operational: {tele.operational_since || 'N/A'}</span>
                </div>
              </div>
              <p className="text-[7px] font-black text-slate-300 uppercase">Telescope ID: {tele.telescope_id}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Telescopes;