import React, { useEffect, useState } from 'react';
import API from '../api';
import { Heart, User, Globe, Loader2, Trash2 } from 'lucide-react';

const Favorites = ({ user }) => {
  const [favs, setFavs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        // If Admin, you might want to see ALL favorites; 
        // if User, just their own. Here we fetch the general log.
        const res = await API.get('/api/user_favourites');
        setFavs(res.data);
      } catch (err) {
        console.error("Link Failure: Could not retrieve interest logs.", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  if (loading) return (
    <div className="p-10 text-slate-400 font-mono flex items-center gap-2">
      <Loader2 className="animate-spin size-4" /> RETRIEVING INTEREST LOGS...
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div>
        <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Interest Registry</h2>
        <p className="text-slate-400 text-xs font-mono uppercase tracking-widest">Global bookmarks and user-saved celestial objects</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Pilot Identification</th>
              <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Saved Object</th>
              <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Priority Status</th>
              <th className="p-4 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {favs.length > 0 ? (
              favs.map((fav) => (
                <tr key={fav.favourite_id} className="hover:bg-red-50/30 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                      <User className="size-4 text-slate-400" />
                      USER_{fav.user_id}
                    </div>
                  </td>
                  <td className="p-4 text-xs text-blue-600 font-black uppercase tracking-tighter">
                    <div className="flex items-center gap-1">
                      <Globe className="size-3 text-blue-400" /> 
                      OBJECT_ID_{fav.object_id}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="flex items-center gap-1 text-[9px] font-black text-red-500 uppercase">
                      <Heart className="size-3 fill-red-500" /> High Interest
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="p-2 text-slate-200 hover:text-red-500 transition-colors">
                      <Trash2 className="size-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-10 text-center text-slate-400 text-xs italic">
                  No interest logs found in current sector.
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