import React, { useState, useEffect } from 'react';
import API from '../api';
import { Plane, Plus, Trash2, Edit2, Check, X, Rocket, Loader2 } from 'lucide-react';

const Spacecraft = ({ user }) => {
  // 1. PLACE THE LOGIC HERE: Strict Role-Based UI Guard
  const isAdmin = user?.role_id === 1;

  const [ships, setShips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // CRUD State
  const [newShip, setNewShip] = useState({ name: '', type: '', capacity: '' });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await API.get('/api/spacecraft');
      setShips(res.data || []);
    } catch (err) {
      console.error("Hangar Link Failure:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // 2. LOGIC PROTECTION: Handler guards
  const handleDelete = async (id) => {
    if (!isAdmin) return; // Prevent Researcher from triggering API
    if (window.confirm("Permanent Decommission: Are you sure?")) {
      try {
        await API.delete(`/api/spacecraft/${id}`);
        fetchData();
      } catch (err) { alert("Action denied."); }
    }
  };

  if (loading) return <div className="p-10 text-blue-600 font-mono animate-pulse flex items-center gap-2"><Loader2 className="animate-spin" /> SCANNING HANGAR...</div>;

  return (
    <div className="space-y-8 font-mono animate-in fade-in duration-700">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Spacecraft Fleet</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Vehicle Status & Deployment Registry</p>
        </div>
        
        {/* 3. UI GUARD: Add button hidden for Researchers */}
        {isAdmin && (
          <button 
            onClick={() => setShowForm(!showForm)} 
            className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase shadow-lg hover:bg-blue-600 transition-all"
          >
            {showForm ? <X size={16}/> : <><Plus size={16}/> Register Vehicle</>}
          </button>
        )}
      </div>

      {/* CREATE FORM: Hidden for Researchers */}
      {showForm && isAdmin && (
        <form className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-top-8 text-white">
          <input className="bg-white/5 border border-white/10 rounded-2xl p-3 text-sm" placeholder="SHIP NAME" onChange={e => setNewShip({...newShip, name: e.target.value})} />
          <input className="bg-white/5 border border-white/10 rounded-2xl p-3 text-sm" placeholder="VEHICLE TYPE" onChange={e => setNewShip({...newShip, type: e.target.value})} />
          <button className="bg-blue-600 rounded-2xl font-black uppercase text-xs">Authorize Entry</button>
        </form>
      )}

      {/* DATA GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ships.map(ship => (
          <div key={ship.spacecraft_id} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all relative group overflow-hidden">
            <div className="flex justify-between items-start mb-6">
              <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                <Plane size={24} />
              </div>
              
              {/* 4. UI GUARD: Edit/Delete icons hidden for Researchers */}
              {isAdmin && (
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-blue-600 hover:text-white"><Edit2 size={14}/></button>
                  <button onClick={() => handleDelete(ship.spacecraft_id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white"><Trash2 size={14}/></button>
                </div>
              )}
            </div>

            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{ship.name}</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-widest">{ship.type || 'INTERSTELLAR CLASS'}</p>
            
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[9px] font-black bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full uppercase">Operational</span>
              <span className="text-[9px] font-bold text-slate-300">REG: #{ship.spacecraft_id}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Spacecraft;