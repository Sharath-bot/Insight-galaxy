import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import API from '../api';
import { 
  Search, Eye, Clock, Plus, Trash2, Edit2, 
  Check, X, Loader2, Database, User, Microscope 
} from 'lucide-react';

const Observations = ({ user: propUser }) => {
  // Use context as a fallback to ensure user role is always known
  const outletUser = useOutletContext();
  const user = propUser || outletUser;
  const isAdmin = user?.role_id === 1;

  const [logs, setLogs] = useState([]);
  const [objects, setObjects] = useState([]);
  const [instruments, setInstruments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Schema-aligned state
  const [newLog, setNewLog] = useState({
    object_id: '', instrument_id: '', observer_user_id: user?.user_id || '',
    observation_date: '', exposure_time_s: '', data_url: '', notes: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const fetchData = async () => {
    setLoading(true);
    try {
      const [obsRes, objRes, instRes] = await Promise.all([
        API.get('/api/observations'),
        API.get('/api/celestial_objects'),
        API.get('/api/instruments')
      ]);
      setLogs(Array.isArray(obsRes.data) ? obsRes.data : []);
      setObjects(objRes.data || []);
      setInstruments(instRes.data || []);
    } catch (err) {
      console.error("Telemetry Link Failure:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // CREATE: POST functionality
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await API.post('/api/observations', {
        ...newLog,
        object_id: Number(newLog.object_id),
        instrument_id: Number(newLog.instrument_id),
        observer_user_id: Number(user?.user_id),
        exposure_time_s: Number(newLog.exposure_time_s)
      });
      setShowForm(false);
      fetchData();
    } catch (err) { alert("Data entry failed. Check constraints."); }
  };

  // UPDATE: PUT functionality
  const handleUpdate = async (id) => {
    try {
      await API.put(`/api/observations/${id}`, editData);
      setEditingId(null);
      fetchData();
    } catch (err) { alert("Recalibration failed."); }
  };

  // DELETE: DELETE functionality
  const handleDelete = async (id) => {
    if (window.confirm("Purge this observation record?")) {
      try {
        await API.delete(`/api/observations/${id}`);
        fetchData();
      } catch (err) { alert("Delete failed."); }
    }
  };

  if (loading) return <div className="p-10 text-blue-600 font-mono flex items-center gap-2"><Loader2 className="animate-spin" /> DOWNLINKING TELEMETRY...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-700 font-mono">
      {/* Header Section */}
      <div className="flex justify-between items-center border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Observation Logs</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Deep Space Telemetry Registry</p>
        </div>
        {isAdmin && (
          <button onClick={() => setShowForm(!showForm)} className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase shadow-lg hover:bg-blue-600 transition-all">
            {showForm ? <X size={16}/> : <><Plus size={16}/> New Entry</>}
          </button>
        )}
      </div>

      {/* CREATE FORM */}
      {showForm && isAdmin && (
        <form onSubmit={handleCreate} className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-blue-400 uppercase">Target Object</label>
            <select required className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-sm" onChange={e => setNewLog({...newLog, object_id: e.target.value})}>
              <option value="">Select Target</option>
              {objects.map(obj => <option key={obj.object_id} value={obj.object_id} className="bg-slate-900">{obj.name}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-blue-400 uppercase">Instrument</label>
            <select required className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-sm" onChange={e => setNewLog({...newLog, instrument_id: e.target.value})}>
              <option value="">Select Sensor</option>
              {instruments.map(inst => <option key={inst.instrument_id} value={inst.instrument_id} className="bg-slate-900">{inst.name}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-blue-400 uppercase">Date/Time</label>
            <input type="datetime-local" required className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-sm" onChange={e => setNewLog({...newLog, observation_date: e.target.value})}/>
          </div>
          <button type="submit" className="lg:col-span-3 bg-blue-600 p-4 rounded-2xl font-black uppercase text-xs">Record Telemetry</button>
        </form>
      )}

      {/* DATA TABLE */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200">
            <tr>
              <th className="p-6">Target/ID</th>
              <th className="p-6">Sensor/Observer</th>
              <th className="p-6">Time/Exposure</th>
              <th className="p-6">Notes</th>
              {isAdmin && <th className="p-6">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {logs.map(log => (
              <tr key={log.observation_id} className="hover:bg-blue-50/20 transition-colors group">
                <td className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Search size={14}/></div>
                    <div>
                      <p className="font-black text-slate-900 uppercase">ID: {log.object_id}</p>
                      <p className="text-[9px] text-slate-400 uppercase">Registry Linked</p>
                    </div>
                  </div>
                </td>
                <td className="p-6">
                  <div className="space-y-1">
                    <p className="flex items-center gap-1 font-bold text-slate-700"><Microscope size={12}/> Inst: {log.instrument_id}</p>
                    <p className="flex items-center gap-1 text-slate-400"><User size={12}/> User: {log.observer_user_id}</p>
                  </div>
                </td>
                <td className="p-6">
                  <div className="space-y-1">
                    <p className="font-bold text-slate-700">{log.observation_date}</p>
                    <p className="text-blue-500 font-black tracking-tighter uppercase flex items-center gap-1">
                      <Clock size={12}/> {log.exposure_time_s || 0}S EXPOSURE
                    </p>
                  </div>
                </td>
                <td className="p-6 max-w-xs">
                  {editingId === log.observation_id ? (
                    <input className="w-full bg-slate-50 border border-blue-200 rounded p-1 outline-none" value={editData.notes} onChange={e => setEditData({...editData, notes: e.target.value})}/>
                  ) : (
                    <p className="text-slate-600 italic">"{log.notes || 'No telemetry notes.'}"</p>
                  )}
                </td>
                {isAdmin && (
                  <td className="p-6">
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {editingId === log.observation_id ? (
                        <button onClick={() => handleUpdate(log.observation_id)} className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-600 hover:text-white"><Check size={14}/></button>
                      ) : (
                        <button onClick={() => { setEditingId(log.observation_id); setEditData({...log}); }} className="p-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-indigo-600 hover:text-white"><Edit2 size={14}/></button>
                      )}
                      <button onClick={() => handleDelete(log.observation_id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white"><Trash2 size={14}/></button>
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

export default Observations;