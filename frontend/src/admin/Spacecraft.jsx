import React, { useEffect, useState } from 'react';
import API from '../api';
import { Plane, Loader2, Zap, Cog, Scale, Plus, Trash2, Edit2, Check, X } from 'lucide-react';

const Spacecraft = () => {
  const [fleet, setFleet] = useState([]);
  const [loading, setLoading] = useState(true);

  // CRUD States
  const [showAddForm, setShowAddForm] = useState(false);
  const [newShip, setNewShip] = useState({ 
    name: "", 
    manufacturer: "", 
    spacecraft_type: "", 
    launch_mass_kg: "" 
  });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const loadFleetData = async () => {
    setLoading(true);
    try {
      const res = await API.get('/api/spacecraft');
      setFleet(res.data);
    } catch (err) {
      console.error("Hangar link failure:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadFleetData(); }, []);

  // --- CRUD FUNCTIONS ---

  // CREATE: Add new vessel
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await API.post('/api/spacecraft', newShip);
      setNewShip({ name: "", manufacturer: "", spacecraft_type: "", launch_mass_kg: "" });
      setShowAddForm(false);
      loadFleetData();
    } catch (err) {
      alert("Error: Vehicle name must be unique.");
    }
  };

  // DELETE: Decommission vessel
  const handleDelete = async (id) => {
    if (window.confirm("Authorize permanent decommissioning of this vessel?")) {
      try {
        await API.delete(`/api/spacecraft/${id}`);
        setFleet(fleet.filter(s => s.spacecraft_id !== id));
      } catch (err) {
        alert("Deletion failed: Vessel is currently assigned to a mission.");
      }
    }
  };

  // UPDATE: Finalize technical specs
  const handleUpdate = async (id) => {
    try {
      await API.put(`/api/spacecraft/${id}`, editData);
      setEditingId(null);
      loadFleetData();
    } catch (err) {
      alert("Update failed. Check system logs.");
    }
  };

  if (loading) return (
    <div className="p-10 text-slate-400 font-mono flex items-center gap-2">
      <Loader2 className="animate-spin size-4" /> SCANNING HANGAR...
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-700 font-mono">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Spacecraft Inventory</h2>
          <p className="text-slate-400 text-xs uppercase tracking-widest">Technical specifications and manufacturing logs</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase hover:bg-blue-600 transition-all"
        >
          {showAddForm ? <X size={16}/> : <><Plus size={16} /> New Vessel</>}
        </button>
      </div>

      {/* CREATE FORM */}
      {showAddForm && (
        <form onSubmit={handleAdd} className="bg-slate-100 p-6 rounded-[2rem] border-2 border-slate-200 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-in slide-in-from-top-4">
          <input className="bg-white rounded-xl px-4 py-2 text-sm outline-none" placeholder="Vessel Name" required value={newShip.name} onChange={(e) => setNewShip({...newShip, name: e.target.value})} />
          <input className="bg-white rounded-xl px-4 py-2 text-sm outline-none" placeholder="Manufacturer" value={newShip.manufacturer} onChange={(e) => setNewShip({...newShip, manufacturer: e.target.value})} />
          <input className="bg-white rounded-xl px-4 py-2 text-sm outline-none" placeholder="Type (e.g. Orbiter)" value={newShip.spacecraft_type} onChange={(e) => setNewShip({...newShip, spacecraft_type: e.target.value})} />
          <input className="bg-white rounded-xl px-4 py-2 text-sm outline-none" placeholder="Mass (KG)" type="number" value={newShip.launch_mass_kg} onChange={(e) => setNewShip({...newShip, launch_mass_kg: e.target.value})} />
          <button type="submit" className="lg:col-span-4 bg-blue-600 text-white py-2 rounded-xl font-bold uppercase text-[10px] hover:bg-blue-700">Add to Fleet</button>
        </form>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {fleet.map((ship) => (
          <div key={ship.spacecraft_id} className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-2xl group transition-all hover:border-blue-500/50">
            <div className="flex justify-between items-start">
              <div className="p-4 bg-blue-500/10 text-blue-400 rounded-2xl">
                <Plane className="size-8" />
              </div>
              <div className="flex gap-2">
                 {editingId === ship.spacecraft_id ? (
                    <button onClick={() => handleUpdate(ship.spacecraft_id)} className="p-2 text-emerald-400 hover:bg-white/5 rounded-xl"><Check size={18}/></button>
                 ) : (
                    <button onClick={() => { setEditingId(ship.spacecraft_id); setEditData(ship); }} className="p-2 text-slate-500 hover:text-blue-400 rounded-xl transition-colors"><Edit2 size={18}/></button>
                 )}
                 <button onClick={() => handleDelete(ship.spacecraft_id)} className="p-2 text-slate-500 hover:text-red-500 rounded-xl transition-colors"><Trash2 size={18}/></button>
              </div>
            </div>

            <div className="mt-6">
              {editingId === ship.spacecraft_id ? (
                <div className="space-y-2">
                  <input className="w-full bg-white/5 border-b border-blue-500 text-white text-xl font-black p-1" value={editData.name} onChange={(e) => setEditData({...editData, name: e.target.value})} />
                  <input className="w-full bg-white/5 border-b border-blue-500 text-slate-400 text-xs p-1" value={editData.manufacturer} onChange={(e) => setEditData({...editData, manufacturer: e.target.value})} />
                </div>
              ) : (
                <>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight">{ship.name}</h3>
                  <div className="flex items-center gap-2 mt-2 text-slate-400 text-xs">
                    <Cog className="size-3 text-blue-500" />
                    <span className="font-mono uppercase tracking-wider">Manufacturer: {ship.manufacturer || "N/A"}</span>
                  </div>
                </>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase mb-1">
                    <Scale className="size-3" /> Launch Mass
                  </div>
                {editingId === ship.spacecraft_id ? (
                  <input className="bg-transparent text-white font-black text-xl w-full border-b border-blue-500" value={editData.launch_mass_kg} onChange={(e) => setEditData({...editData, launch_mass_kg: e.target.value})} />
                ) : (
                  <div className="text-xl font-black text-white">{ship.launch_mass_kg ? `${ship.launch_mass_kg} KG` : 'Unknown'}</div>
                )}
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase mb-1">
                  <Zap className="size-3" /> Class
                </div>
                {editingId === ship.spacecraft_id ? (
                   <input className="bg-transparent text-emerald-400 font-black text-xl w-full border-b border-blue-500" value={editData.spacecraft_type} onChange={(e) => setEditData({...editData, spacecraft_type: e.target.value})} />
                ) : (
                  <div className="text-xl font-black text-blue-400 uppercase">{ship.spacecraft_type || 'Vessel'}</div>
                )}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center text-[10px] font-mono text-slate-500">
               <span>SYS_ID: {ship.spacecraft_id}</span>
               <span className="text-blue-500/50 uppercase">Fleet Archive Status: Verified</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Spacecraft;