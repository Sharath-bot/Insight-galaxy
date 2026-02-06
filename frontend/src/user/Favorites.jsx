import React, { useEffect, useState } from 'react';
import API from '../api';
import { Heart, Globe, Trash2, Rocket } from 'lucide-react';

const Favorites = ({ user }) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        // GET request using the current user's ID
        const res = await API.get(`/api/favorites/${user.user_id}`);
        setFavorites(res.data);
      } catch (err) {
        console.error("Link failed: Could not retrieve your favorite objects.");
      }
    };
    if (user) fetchFavorites();
  }, [user]);

  const removeFavorite = async (objectId) => {
    try {
      await API.delete(`/api/favorites/${user.user_id}/${objectId}`);
      setFavorites(favorites.filter(fav => fav.object_id !== objectId));
    } catch (err) {
      alert("Could not remove item from favorites.");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div>
        <h2 className="text-2xl font-black text-emerald-900 uppercase">My Favorites</h2>
        <p className="text-emerald-500 text-[10px] font-bold uppercase tracking-[0.3em]">Personal Saved Discoveries</p>
      </div>

      {favorites.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-emerald-100 rounded-3xl p-12 text-center">
          <Heart className="size-12 text-emerald-100 mx-auto mb-4" />
          <p className="text-slate-400 text-sm font-bold uppercase">No objects saved to your terminal yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {favorites.map((fav) => (
            <div key={fav.object_id} className="bg-white p-6 rounded-3xl border border-emerald-50 shadow-sm flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-50 rounded-2xl">
                  <Globe className="size-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800 uppercase leading-tight">{fav.name}</h3>
                  <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">{fav.type}</p>
                </div>
              </div>
              
              <button 
                onClick={() => removeFavorite(fav.object_id)}
                className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
              >
                <Trash2 className="size-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;