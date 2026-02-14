import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import API from '../api';
import { 
  Heart, User, Globe, Loader2, Trash2, 
  Plus, X, Check, Search, Database 
} from 'lucide-react';

const Favorites = ({ user: propUser }) => {
  // Use context as fallback to ensure authorization state is active
  const outletUser = useOutletContext();
  const user = propUser || outletUser;
  const isAdmin = user?.role_id === 1;

  const [favs, setFavs] = useState([]);
  const [objects, setObjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // State for new bookmark based on SQL schema
  const [newFav, setNewFav] = useState({
    user_id: user?.user_id || '',
    object_id: '',
    notes: '' 
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch both the favorites log and the available celestial objects
      const [favRes, objRes] = await Promise.all([
        API.get('/api/user_favourites'),
        API.get('/api/celestial_objects')
      ]);
      
      // If not Admin, filter to show only current user's bookmarks
      const data = Array.isArray(favRes.data) ? favRes.data : [];
      setFavs(isAdmin ? data : data.filter(f => f.user_id === user?.user_id));
      setObjects(objRes.data || []);
    } catch (err) {
      console.error("Link Failure: Interest logs unreachable.", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [user]);

  // CREATE: POST functionality
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        user_id: Number(user?.user_id),
        object_id: Number(newFav.object_id)
      };
      await API.post('/api/user_favourites', payload);
      setShowForm(false);
      fetchData();
    } catch (err) {
      alert("Bookmark failed: Object may already be in your registry.");
    }
  };

  // DELETE: DELETE functionality
  const handleDelete = async (id) => {
    if (window.confirm("Remove this object from interest registry?")) {
      try {
        await API.delete(`/api/user_favourites/${id}`);
        fetchData();
      } catch (err) {
        alert("Action blocked: Protocol error.");
      }
    }
  };

  if (loading) return (
    <div className="p-10 text-slate-400 font-mono flex items-center gap-2">
      <Loader2 className="animate-spin size-4" /> RETRIEVING INTEREST LOGS...
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700 font-mono">
      {/* Header Section */}
      <div className="flex justify-between items-center border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Interest Registry</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            {isAdmin ? "Global User Bookmarks" : "Personal Celestial Monitoring"}
          </p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase shadow-lg hover:bg-red-500 transition-all flex items-center gap-2"
        >
          {showForm ? <X size={16}/> : <><Plus size={16}/> New Bookmark</>}
        </button>
      </div>

      {/* CREATE FORM */}
      {showForm && (
        <form onSubmit={handleCreate} className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-top-8">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-red-400 uppercase ml-2">Target Celestial Object</label>
            <select 
              required 
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-sm outline-none focus:border-red-500 transition-colors"
              onChange={e => setNewFav({...newFav, object_id: e.target.value})}
            >
              <option value="" className="bg-slate-900">Select Object from Database</option>
              {objects.map(obj => (
                <option key={obj.object_id} value={obj.object_id} className="bg-slate-900">
                  {obj.name} (ID: {obj.object_id})
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button type="submit" className="w-full bg-red-600 p-4 rounded-2xl font-black uppercase text-xs hover:bg-red-500 transition-colors flex items-center justify-center gap-2">
              <Heart size={16} className="fill-white" /> Synchronize Interest
            </button>
          </div>
        </form>
      )}

      {/* DATA TABLE */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200">
            <tr>
              <th className="p-6">Pilot Identification</th>
              <th className="p-6">Object Link</th>
              <th className="p-6">Registry Status</th>
              <th className="p-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {favs.length > 0 ? (
              favs.map((fav) => (
                <tr key={fav.favourite_id} className="hover:bg-red-50/20 transition-colors group">
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 text-slate-600 rounded-lg group-hover:bg-slate-900 group-hover:text-white transition-all">
                        <User size={14} />
                      </div>
                      <span className="font-black text-slate-900 uppercase">
                        {fav.user_id === user?.user_id ? "YOU (PILOT_LOG)" : `PILOT_${fav.user_id}`}
                      </span>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-2 text-blue-600 font-black uppercase">
                      <Globe size={14} className="text-blue-400" />
                      OBJECT_REF_{fav.object_id}
                    </div>
                  </td>
                  <td className="p-6">
                    <span className="flex items-center gap-1 text-[9px] font-black text-red-500 uppercase bg-red-50 px-3 py-1 rounded-full w-fit">
                      <Heart size={10} className="fill-red-500" /> High Priority Interest
                    </span>
                  </td>
                  <td className="p-6 text-right">
                    {/* Only show delete if user owns the favorite or is Admin */}
                    {(isAdmin || fav.user_id === user?.user_id) && (
                      <button 
                        onClick={() => handleDelete(fav.favourite_id)} 
                        className="p-2 text-slate-200 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-20 text-center">
                  <div className="flex flex-col items-center gap-3 text-slate-400">
                    <Database size={32} className="opacity-20" />
                    <p className="text-xs font-bold uppercase tracking-widest italic">No interest logs found in current sector.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Favorites;