import React, { useState, useEffect } from 'react';
import API from '../api';
import { 
  Sparkles, Plus, Trash2,  Edit2, Check, X
  //Calendar, Hash, Building2, Compass, Ruler, Rocket
} from 'lucide-react';

export default function CelestialObject({ user }) {
  const [objects, setObjects] = useState([]);
  const [types, setTypes] = useState([]);
  const [agencies, setAgencies] = useState([]);
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Administrative verification
  const isAdmin = user?.role_id === 1;

  // Schema-aligned state
  const [newObject, setNewObject] = useState({
    name: '', type_id: '', right_ascension: '', declination: '', 
    distance_ly: '', discovered_by_agency_id: '', 
    discovered_by_mission_id: '', discovery_date: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const fetchData = async () => {
    setLoading(true);
    try {
      const [objRes, typeRes, agencyRes, missionRes] = await Promise.all([
        API.get('/api/celestial_objects'),
        API.get('/api/object_types'),
        API.get('/api/agencies'),
        API.get('/api/missions')
      ]);
      setObjects(Array.isArray(objRes.data) ? objRes.data : []);
      setTypes(typeRes.data || []);
      setAgencies(agencyRes.data || []);
      setMissions(missionRes.data || []);
    } catch (err) {
      console.error("Deep Space Scan Failed:", err);
      setObjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newObject,
        type_id: Number(newObject.type_id),
        discovered_by_agency_id: newObject.discovered_by_agency_id ? Number(newObject.discovered_by_agency_id) : null,
        discovered_by_mission_id: newObject.discovered_by_mission_id ? Number(newObject.discovered_by_mission_id) : null
      };
      await API.post('/api/celestial_objects', payload);
      setShowForm(false);
      setNewObject({ name: '', type_id: '', right_ascension: '', declination: '', distance_ly: '', discovered_by_agency_id: '', discovered_by_mission_id: '', discovery_date: '' });
      fetchData();
    } catch (err) { alert("Registration failed. Verify coordinates and unique name."); }
  };

  const handleUpdate = async (id) => {
    try {
      const payload = { 
        ...editData,
        type_id: Number(editData.type_id),
        discovered_by_agency_id: editData.discovered_by_agency_id ? Number(editData.discovered_by_agency_id) : null
      };
      await API.put(`/api/celestial_objects/${id}`, payload);
      setEditingId(null);
      fetchData();
    } catch (err) { alert("Database rejected update protocol."); }
  };

  // Helper Lookups
  const getTypeName = (id) => types.find(t => Number(t.type_id) === Number(id))?.type_name || "Unclassified";
  const getAgencyName = (id) => agencies.find(a => Number(a.agency_id) === Number(id))?.name || "Independent";

  if (loading) return <div className="p-20 text-center font-mono text-blue-500 animate-pulse uppercase">Syncing Star Catalog...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-700 font-mono">
      <div className="flex justify-between items-center border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Celestial Registry</h1>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Astronomical Coordinate Management</p>
        </div>
        {isAdmin && (
          <button onClick={() => setShowForm(!showForm)} className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-tighter hover:bg-indigo-600 transition-all shadow-lg">
            {showForm ? <X size={16}/> : <><Plus size={16}/> Register Object</>}
          </button>
        )}
      </div>

      {showForm && isAdmin && (
        <form onSubmit={handleCreate} className="bg-slate-900 text-white p-8 rounded-[3rem] shadow-2xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in slide-in-from-top-8">
          <div className="lg:col-span-2 space-y-1">
            <label className="text-[10px] font-black text-indigo-400 uppercase ml-2">Designation</label>
            <input className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-sm outline-none" required onChange={e => setNewObject({...newObject, name: e.target.value})}/>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-indigo-400 uppercase ml-2">Type</label>
            <select className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-sm outline-none" required onChange={e => setNewObject({...newObject, type_id: e.target.value})}>
              <option value="">Select Type</option>
              {types.map(t => <option key={t.type_id} value={t.type_id} className="bg-slate-900">{t.type_name}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-indigo-400 uppercase ml-2">Distance (LY)</label>
            <input className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-sm outline-none" type="number" step="0.0001" onChange={e => setNewObject({...newObject, distance_ly: e.target.value})}/>
          </div>
          <button type="submit" className="lg:col-span-4 bg-indigo-600 p-4 rounded-2xl font-black uppercase text-xs">Authorize Entry</button>
        </form>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pb-20">
        {objects.map((obj) => (
          <div key={obj.object_id} className="bg-white border border-slate-200 rounded-[2.5rem] p-8 hover:shadow-xl transition-all group relative overflow-hidden">
            <div className="flex flex-col lg:flex-row justify-between gap-8">
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <Sparkles size={24} />
                  </div>
                  <div>
                    {editingId === obj.object_id ? (
                      <input className="text-2xl font-black text-slate-900 border-b-2 border-indigo-500 outline-none" value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})}/>
                    ) : (
                      <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{obj.name || obj.object_name}</h2>
                    )}
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-indigo-50 text-indigo-500 block w-fit mt-1">{getTypeName(obj.type_id)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                   <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
                      <p className="text-[8px] font-black text-slate-400 uppercase mb-1">RA / DEC</p>
                      <p className="text-[10px] font-bold text-slate-700">{obj.right_ascension || '0.0'} / {obj.declination || '0.0'}</p>
                   </div>
                   <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
                      <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Distance</p>
                      <p className="text-[10px] font-bold text-slate-700">{obj.distance_ly || '---'} LY</p>
                   </div>
                   <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
                      <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Agency</p>
                      <p className="text-[10px] font-bold text-slate-700 truncate">{getAgencyName(obj.discovered_by_agency_id)}</p>
                   </div>
                </div>
              </div>

              {isAdmin && (
                <div className="flex md:flex-col justify-end gap-2 border-l border-slate-100 pl-6">
                  {editingId === obj.object_id ? (
                    <button onClick={() => handleUpdate(obj.object_id)} className="p-3 bg-emerald-500 text-white rounded-xl"><Check size={18}/></button>
                  ) : (
                    <button onClick={() => { setEditingId(obj.object_id); setEditData({...obj}); }} className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all"><Edit2 size={18}/></button>
                  )}
                  <button className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"><Trash2 size={18}/></button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}