import React, { useState, useEffect } from 'react';
import API from '../api';
import { 
  Microscope, Plus, Trash2, Edit2, Check, X, 
  Loader2, Cpu, Settings, Layers, search
} from 'lucide-react';

const Instruments = ({ user }) => {
  const [tools, setTools] = useState([]);
  const [telescopes, setTelescopes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const isAdmin = user?.role_id === 1; //

  // Schema-aligned state
  const [newInstrument, setNewInstrument] = useState({
    name: '', telescope_id: '', instrument_type: '', resolution: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const fetchData = async () => {
    setLoading(true);
    try {
      const [instRes, teleRes] = await Promise.all([
        API.get('/api/instruments'),
        API.get('/api/telescopes')
      ]);
      setTools(Array.isArray(instRes.data) ? instRes.data : []);
      setTelescopes(teleRes.data || []);
    } catch (err) {
      console.error("Sensor Link Failure:", err);
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
        ...newInstrument,
        telescope_id: Number(newInstrument.telescope_id)
      };
      await API.post('/api/instruments', payload);
      setShowForm(false);
      setNewInstrument({ name: '', telescope_id: '', instrument_type: '', resolution: '' });
      fetchData();
    } catch (err) { alert("Deployment failed. Verify telescope link."); }
  };

  // UPDATE: PUT functionality
  const handleUpdate = async (id) => {
    try {
      const payload = {
        ...editData,
        telescope_id: Number(editData.telescope_id)
      };
      await API.put(`/api/instruments/${id}`, payload);
      setEditingId(null);
      fetchData();
    } catch (err) { alert("Recalibration failed."); }
  };

  // DELETE: DELETE functionality
  const handleDelete = async (id) => {
    if (window.confirm("Confirm decommissioning of this instrument?")) {
      try {
        await API.delete(`/api/instruments/${id}`);
        fetchData();
      } catch (err) { alert("Action blocked: Linked observation records exist."); }
    }
  };

  const getTeleName = (id) => telescopes.find(t => Number(t.telescope_id) === Number(id))?.name || "Unlinked";

  if (loading) return <div className="p-10 text-emerald-600 font-mono flex items-center gap-2 animate-pulse"><Loader2 className="animate-spin" /> INITIALIZING SENSORS...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-700 font-mono">
      {/* Header Section */}
      <div className="flex justify-between items-center border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Instrument Registry</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Scientific Sensor Configuration</p>
        </div>
        {isAdmin && (
          <button onClick={() => setShowForm(!showForm)} className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase shadow-lg hover:bg-emerald-600 transition-all">
            {showForm ? <X size={16}/> : <><Plus size={16}/> New Instrument</>}
          </button>
        )}
      </div>

      {/* CREATE FORM */}
      {showForm && isAdmin && (
        <form onSubmit={handleCreate} className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in slide-in-from-top-8">
          <div className="lg:col-span-2 space-y-1">
            <label className="text-[10px] font-black text-emerald-400 uppercase ml-2">Instrument Name</label>
            <input required className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-sm outline-none" value={newInstrument.name} onChange={e => setNewInstrument({...newInstrument, name: e.target.value})}/>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-emerald-400 uppercase ml-2">Telescope Link</label>
            <select required className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-sm outline-none" onChange={e => setNewInstrument({...newInstrument, telescope_id: e.target.value})}>
              <option value="">Select Host</option>
              {telescopes.map(t => <option key={t.telescope_id} value={t.telescope_id} className="bg-slate-900">{t.name}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-emerald-400 uppercase ml-2">Type</label>
            <input placeholder="e.g. Spectrograph" className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-sm outline-none" onChange={e => setNewInstrument({...newInstrument, instrument_type: e.target.value})}/>
          </div>
          <div className="lg:col-span-4 space-y-1">
            <label className="text-[10px] font-black text-emerald-400 uppercase ml-2">Resolution Specifications</label>
            <input placeholder="e.g. 0.1 arcsec / 10km" className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-sm outline-none" onChange={e => setNewInstrument({...newInstrument, resolution: e.target.value})}/>
          </div>
          <button type="submit" className="lg:col-span-4 bg-emerald-600 p-4 rounded-2xl font-black uppercase text-xs hover:bg-emerald-500 transition-colors">Authorize Deployment</button>
        </form>
      )}

      {/* DISPLAY GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 pb-20">
        {tools.map(tool => (
          <div key={tool.instrument_id} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all relative group overflow-hidden">
            <div className="flex justify-between items-start mb-6">
              <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <Microscope size={24} />
              </div>
              {isAdmin && (
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                  {editingId === tool.instrument_id ? (
                    <button onClick={() => handleUpdate(tool.instrument_id)} className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Check size={14}/></button>
                  ) : (
                    <button onClick={() => { setEditingId(tool.instrument_id); setEditData({...tool}); }} className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-emerald-600 hover:text-white"><Edit2 size={14}/></button>
                  )}
                  <button onClick={() => handleDelete(tool.instrument_id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white"><Trash2 size={14}/></button>
                </div>
              )}
            </div>

            {/* Editable Name */}
            {editingId === tool.instrument_id ? (
              <input className="text-xl font-black uppercase bg-slate-50 border-b-2 border-emerald-500 w-full outline-none p-1" value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})}/>
            ) : (
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight truncate">{tool.name}</h3>
            )}
            
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="bg-slate-50 p-3 rounded-xl flex items-center gap-2">
                <search size={12} className="text-slate-400" />
                <div>
                   <p className="text-[7px] font-black text-slate-400 uppercase">Host System</p>
                   <p className="text-[9px] font-bold text-slate-700 truncate">{getTeleName(tool.telescope_id)}</p>
                </div>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl flex items-center gap-2">
                <Layers size={12} className="text-slate-400" />
                <div>
                   <p className="text-[7px] font-black text-slate-400 uppercase">Type</p>
                   <p className="text-[9px] font-bold text-slate-700 truncate">{tool.instrument_type || 'Sensor'}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-500">
                <Settings size={12} className="text-emerald-500"/>
                <span className="text-[9px] font-bold uppercase tracking-tighter">Res: {tool.resolution || 'Standard'}</span>
              </div>
              <p className="text-[7px] font-black text-slate-300 uppercase">Inst. ID: {tool.instrument_id}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Instruments;