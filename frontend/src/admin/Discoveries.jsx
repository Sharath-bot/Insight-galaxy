import React, { useEffect, useState } from 'react';
import API from '../api';
import { Star, Trash2, Plus, Loader2 } from 'lucide-react';

const Discoveries = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // READ: Fetch all discoveries
  const fetchDiscoveries = async () => {
    try {
      const res = await API.get('/api/discoveries');
      setData(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchDiscoveries(); }, []);

  // DELETE: Remove a record
  const handleDelete = async (id) => {
    if (window.confirm("Permanent Deletion: Are you sure?")) {
      try {
        await API.delete(`/api/discoveries/${id}`);
        setData(data.filter(item => item.discovery_id !== id));
      } catch (err) { alert("Deletion failed. Check backend."); }
    }
  };

  if (loading) return <div className="p-10 text-slate-400 font-mono italic">Accessing Archives...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-slate-800 uppercase">Discovery Archives</h2>
        {/* CREATE: Link to a form or open a modal */}
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-700 transition-all">
          <Plus size={16} /> Log New Discovery
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 text-[10px] font-black text-slate-500 uppercase">Discovery</th>
              <th className="p-4 text-[10px] font-black text-slate-500 uppercase">Object</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((item) => (
              <tr key={item.discovery_id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 font-bold text-slate-900 text-xs">
                  <div className="flex items-center gap-2"><Star className="size-3 text-yellow-500" />{item.discovery_name}</div>
                </td>
                <td className="p-4 text-xs text-blue-600 font-black uppercase">{item.object_name}</td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    {/* UPDATE Button */}
                    <button className="p-2 text-slate-400 hover:text-blue-600"><Plus size={14} /></button>
                    {/* DELETE Button */}
                    <button onClick={() => handleDelete(item.discovery_id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default Discoveries;