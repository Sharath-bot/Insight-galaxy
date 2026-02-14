import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import API from '../api';
import { 
  Star, Trash2, Plus, Loader2, Check, X, 
  Edit2, Calendar, Rocket, Search, Info 
} from 'lucide-react';

const Discoveries = ({ user: propUser }) => {
  // Syncing with AdminPortal context for CRUD access
  const outletUser = useOutletContext();
  const user = propUser || outletUser;
  const isAdmin = user?.role_id === 1;

  const [data, setData] = useState([]);
  const [objects, setObjects] = useState([]);
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Schema-aligned state
  const [newDiscovery, setNewDiscovery] = useState({
    object_id: '', mission_id: '', discovery_date: '', 
    description: '', confirmed_by_mission_id: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const fetchData = async () => {
    setLoading(true);
    try {
      const [discRes, objRes, missRes] = await Promise.all([
        API.get('/api/discoveries'),
        API.get('/api/celestial_objects'),
        API.get('/api/missions')
      ]);
      setData(Array.isArray(discRes.data) ? discRes.data : []);
      setObjects(objRes.data || []);
      setMissions(missRes.data || []);
    } catch (err) {
      console.error("Archive Retrieval Failure:", err);
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
        ...newDiscovery,
        object_id: Number(newDiscovery.object_id),
        mission_id: newDiscovery.mission_id ? Number(newDiscovery.mission_id) : null,
        confirmed_by_mission_id: newDiscovery.confirmed_by_mission_id ? Number(newDiscovery.confirmed_by_mission_id) : null
      };
      await API.post('/api/discoveries', payload);
      setShowForm(false);
      setNewDiscovery({ object_id: '', mission_id: '', discovery_date: '', description: '', confirmed_by_mission_id: '' });
      fetchData();
    } catch (err) { alert("Registration failed. Check foreign key links."); }
  };

  // UPDATE: PUT functionality
  const handleUpdate = async (id) => {
    try {
      await API.put(`/api/discoveries/${id}`, editData);
      setEditingId(null);
      fetchData();
    } catch (err) { alert("Data revision failed."); }
  };

  // DELETE: DELETE functionality
  const handleDelete = async (id) => {
    if (window.confirm("Archive Deletion: Are you sure?")) {
      try {
        await API.delete(`/api/discoveries/${id}`);
        fetchData();
      } catch (err) { alert("Deletion failed."); }
    }
  };

  if (loading) return <div className="p-10 text-slate-400 font-mono italic animate-pulse">Accessing Archives...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-700 font-mono">
      {/* Header Section */}
      <div className="flex justify-between items-center border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Discovery Archives</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Stellar Event Registry</p>
        </div>
        {isAdmin && (
          <button onClick={() => setShowForm(!showForm)} className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase shadow-lg hover:bg-yellow-500 transition-all">
            {showForm ? <X size={16}/> : <><Plus size={16}/> Log Discovery</>}
          </button>
        )}
      </div>

      {/* CREATE FORM */}
      {showForm && isAdmin && (
        <form onSubmit={handleCreate} className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-top-8">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-yellow-400 uppercase ml-2">Celestial Target</label>
            <select required className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-sm" onChange={e => setNewDiscovery({...newDiscovery, object_id: e.target.value})}>
              <option value="">Select Object</option>
              {objects.map(obj => <option key={obj.object_id} value={obj.object_id} className="bg-slate-900">{obj.name}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-yellow-400 uppercase ml-2">Discovery Mission</label>
            <select className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-sm" onChange={e => setNewDiscovery({...newDiscovery, mission_id: e.target.value})}>
              <option value="">Independent Scan</option>
              {missions.map(m => <option key={m.mission_id} value={m.mission_id} className="bg-slate-900">{m.name}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-yellow-400 uppercase ml-2">Registry Date</label>
            <input type="date" required className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-sm" onChange={e => setNewDiscovery({...newDiscovery, discovery_date: e.target.value})}/>
          </div>
          <div className="lg:col-span-3 space-y-1">
            <label className="text-[10px] font-black text-yellow-400 uppercase ml-2">Description</label>
            <input className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-sm" placeholder="Summarize discovery findings..." onChange={e => setNewDiscovery({...newDiscovery, description: e.target.value})}/>
          </div>
          <button type="submit" className="lg:col-span-3 bg-yellow-600 p-4 rounded-2xl font-black uppercase text-xs hover:bg-yellow-500 transition-colors">Confirm Log Entry</button>
        </form>
      )}

      {/* DATA TABLE */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200">
            <tr>
              <th className="p-6">Target Object</th>
              <th className="p-6">Registry Data</th>
              <th className="p-6">Verification</th>
              <th className="p-6">Findings</th>
              {isAdmin && <th className="p-6 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {data.map(item => (
              <tr key={item.discovery_id} className="hover:bg-yellow-50/20 transition-colors group">
                <td className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg"><Star size={14}/></div>
                    <span className="font-black text-slate-900 uppercase">OBJ ID: {item.object_id}</span>
                  </div>
                </td>
                <td className="p-6">
                  <div className="space-y-1">
                    <p className="flex items-center gap-1 font-bold text-slate-700"><Calendar size={12}/> {item.discovery_date}</p>
                    <p className="flex items-center gap-1 text-slate-400 uppercase text-[9px] font-black"><Rocket size={12}/> Mission ID: {item.mission_id || 'N/A'}</p>
                  </div>
                </td>
                <td className="p-6">
                   <div className="bg-emerald-50 text-emerald-600 p-2 rounded-xl text-[9px] font-black inline-flex items-center gap-1 uppercase">
                     <Check size={10}/> Confirmed By: {item.confirmed_by_mission_id || 'Ground Control'}
                   </div>
                </td>
                <td className="p-6 max-w-xs">
                  {editingId === item.discovery_id ? (
                    <input className="w-full bg-slate-50 border border-yellow-200 rounded p-1 outline-none font-sans" value={editData.description} onChange={e => setEditData({...editData, description: e.target.value})}/>
                  ) : (
                    <p className="text-slate-600 italic leading-relaxed truncate group-hover:whitespace-normal group-hover:overflow-visible">"{item.description || 'No detailed log available.'}"</p>
                  )}
                </td>
                {isAdmin && (
                  <td className="p-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {editingId === item.discovery_id ? (
                        <button onClick={() => handleUpdate(item.discovery_id)} className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-600 hover:text-white transition-all"><Check size={14}/></button>
                      ) : (
                        <button onClick={() => { setEditingId(item.discovery_id); setEditData({...item}); }} className="p-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-yellow-600 hover:text-white transition-all"><Edit2 size={14}/></button>
                      )}
                      <button onClick={() => handleDelete(item.discovery_id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all"><Trash2 size={14}/></button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Discoveries;