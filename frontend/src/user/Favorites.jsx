import React, { useState, useEffect } from 'react';
import API from '../api';
import { Star, Globe, Trash2, Loader2, Map } from 'lucide-react';

const Favorites = ({ user }) => {
  const [favs, setFavs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetching favorites for the specific logged-in user
    if (user?.user_id) {
      API.get(`/api/user/favorites/${user.user_id}`)
        .then(res => setFavs(res.data || []))
        .catch(err => console.error("Telemetry Sync Failure", err))
        .finally(() => setLoading(false));
    }
  }, [user]);

  const removeFavorite = async (objectId) => {
    try {
      await API.delete(`/api/user/favorites/${user.user_id}/${objectId}`);
      setFavs(favs.filter(f => f.object_id !== objectId));
    } catch (err) {
      console.error("Failed to remove bookmark", err);
    }
  };

  if (loading) return (
    <div className="p-10 font-mono text-amber-500 animate-pulse flex items-center gap-2">
      <Loader2 className="animate-spin" /> RETRIEVING STARRED ENTITIES...
    </div>
  );

  return (
    <div className="space-y-6 font-mono">
      <header className="border-b border-slate-200 pb-4">
        <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">My Star Catalog</h2>
        <p className="text-amber-500 text-[10px] font-bold uppercase tracking-widest mt-1">Personal Celestial Registry</p>
      </header>

      {favs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favs.map((item) => (
            <div key={item.object_id} className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm group hover:border-amber-300 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-amber-50 text-amber-500 rounded-2xl group-hover:bg-amber-500 group-hover:text-white transition-all">
                  <Globe size={20} />
                </div>
                <button 
                  onClick={() => removeFavorite(item.object_id)}
                  className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <h3 className="text-lg font-black text-slate-900 uppercase">
                {item.name || `Object #${item.object_id}`}
              </h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 flex items-center gap-1">
                <Map size={12}/> Added: {new Date(item.added_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
          <Star size={40} className="mx-auto text-slate-200 mb-4" />
          <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">No objects saved yet</p>
          <p className="text-slate-300 text-[10px] mt-2 italic">Visit the Celestial Registry to bookmark objects.</p>
        </div>
      )}
    </div>
  );
};

export default Favorites;