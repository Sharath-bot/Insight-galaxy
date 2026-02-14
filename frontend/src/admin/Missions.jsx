import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import API from '../api';
import { 
  Rocket, Plus, Trash2, Edit2, Check, X, 
  Loader2, Calendar, MapPin, Activity, Plane
} from 'lucide-react';

const Missions = ({ user: propUser }) => {
  // Accessing authorization state from App.jsx/AdminPortal
  const outletUser = useOutletContext();
  const user = propUser || outletUser;
  const isAdmin = user?.role_id === 1;

  const [data, setData] = useState([]);
  const [spacecraft, setSpacecraft] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Schema-aligned state for Missions
  const [newMission, setNewMission] = useState({
    name: '', spacecraft_id: '', launch_date: '', 
    status: 'Scheduled', destination: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const fetchData = async () => {
    setLoading(true);
    try {
      const [missRes, shipRes] = await Promise.all([
        API.get('/api/missions'),
        API.get('/api/spacecraft')
      ]);
      setData(Array.isArray(missRes.data) ? missRes.data : []);
      setSpacecraft(shipRes.data || []);
    } catch (err) {
      console.error("Flight Control Failure:", err);
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
        ...newMission,
        spacecraft_id: Number(newMission.spacecraft_id)
      };
      await API.post('/api/missions', payload);
      setShowForm(false);
      setNewMission({ name: '', spacecraft_id: '', launch_date: '', status: 'Scheduled', destination: '' });
      fetchData();
    } catch (err) { alert("Launch aborted: Check mission parameters."); }
  };

  // UPDATE: PUT functionality
  const handleUpdate = async (id) => {
    try {
      await API.put(`/api/missions/${id}`, editData);
      setEditingId(null);
      fetchData();
    } catch (err) { alert("Course correction failed."); }
  };

  // DELETE: DELETE functionality
  const handleDelete = async (id) => {
    if (window.confirm("Permanent Deletion: Scrapping this mission registry?")) {
      try {
        await API.delete(`/api/missions/${id}`);
        fetchData();
      } catch (err) { alert("Action blocked: Linked crew or discoveries exist."); }
    }
  };

  const getShipName = (id) => spacecraft.find(s => Number(s.spacecraft_id) === Number(id))?.name || "Unassigned";

  if (loading) return <div className="p-10 text-slate-400 font-mono flex items-center gap-2 animate-pulse"><Loader2 className="animate-spin" /> SYNCHRONIZING FLIGHT DATA...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-700 font-mono">
      {/* Header Section */}
      <div className="flex justify-between items-center border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Mission Control</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Flight Logistics & Status Registry</p>
        </div>
        {isAdmin && (
          <button onClick={() => setShowForm(!showForm)} className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase shadow-lg hover:bg-indigo-600 transition-all flex items-center gap-2">
            {showForm ? <X size={16}/> : <><Plus size={16}/> New Mission</>}
          </button>
        )}
      </div>

      {/* CREATE FORM */}
      {showForm && isAdmin && (
        <form onSubmit={handleCreate} className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-top-8">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-indigo-400 uppercase ml-2">Mission Name</label>
            <input required className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-sm outline-none" onChange={e => setNewMission({...newMission, name: e.target.value})}/>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-indigo-400 uppercase ml-2">Assigned Spacecraft</label>
            <select required className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-sm outline-none" onChange={e => setNewMission({...newMission, spacecraft_id: e.target.value})}>
              <option value="">Select Ship</option>
              {spacecraft.map(s => <option key={s.spacecraft_id} value={s.spacecraft_id} className="bg-slate-900">{s.name}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-indigo-400 uppercase ml-2">Launch Date</label>
            <input type="date" required className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-sm outline-none" onChange={e => setNewMission({...newMission, launch_date: e.target.value})}/>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-indigo-400 uppercase ml-2">Destination</label>
            <input required className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-sm outline-none" placeholder="e.g. Lunar Orbit" onChange={e => setNewMission({...newMission, destination: e.target.value})}/>
          </div>
          <button type="submit" className="lg:col-span-3 bg-indigo-600 p-4 rounded-2xl font-black uppercase text-xs mt-4">Authorize Mission</button>
        </form>
      )}

      {/* DISPLAY GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 pb-20">
        {data.map(miss => (
          <div key={miss.mission_id} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all relative group overflow-hidden">
            <div className="flex justify-between items-start mb-6">
              <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl">
                <Rocket size={24} />
              </div>
              {isAdmin && (
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                  {editingId === miss.mission_id ? (
                    <button onClick={() => handleUpdate(miss.mission_id)} className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Check size={14}/></button>
                  ) : (
                    <button onClick={() => { setEditingId(miss.mission_id); setEditData({...miss}); }} className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-indigo-600 hover:text-white"><Edit2 size={14}/></button>
                  )}
                  <button onClick={() => handleDelete(miss.mission_id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white"><Trash2 size={14}/></button>
                </div>
              )}
            </div>

            {editingId === miss.mission_id ? (
              <input className="text-xl font-black uppercase bg-slate-50 border-b-2 border-indigo-500 w-full outline-none p-1 mb-4" value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})}/>
            ) : (
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight truncate">{miss.name}</h3>
            )}
            
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="bg-slate-50 p-3 rounded-xl flex items-center gap-2">
                <Plane size={12} className="text-slate-400" />
                <div>
                   <p className="text-[7px] font-black text-slate-400 uppercase">Spacecraft</p>
                   <p className="text-[9px] font-bold text-slate-700 truncate">{getShipName(miss.spacecraft_id)}</p>
                </div>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl flex items-center gap-2">
                <Activity size={12} className="text-slate-400" />
                <div>
                   <p className="text-[7px] font-black text-slate-400 uppercase">Status</p>
                   <p className={`text-[9px] font-bold uppercase ${miss.status === 'Active' ? 'text-emerald-600' : 'text-slate-700'}`}>{miss.status}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-500">
                <Calendar size={12} className="text-indigo-500"/>
                <span className="text-[9px] font-bold">{miss.launch_date}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <MapPin size={12} className="text-indigo-500"/>
                <span className="text-[9px] font-bold uppercase truncate max-w-[80px]">{miss.destination}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Missions;