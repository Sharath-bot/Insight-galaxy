import React, { useEffect, useState } from 'react';
import API from '../api'; // Fixed: Pointing to your new api.js file
import { Globe, Search, Info, Heart } from 'lucide-react';

const CelestialObjects = ({ user }) => { // 1. Pass user here
  const [objects, setObjects] = useState([]);
  const [filter, setFilter] = useState('');

  // 2. Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.get('/api/celestial_objects');
        setObjects(response.data);
      } catch (err) {
        console.error("Signal lost: Could not retrieve object data.");
      }
    };
    fetchData();
  }, []);

  // 3. Logic for Favoriting
  const toggleFavorite = async (objectId) => {
    try {
      if (!user || !user.user_id) {
        alert("Please log in to save favorites.");
        return;
      }
      await API.post('/api/favorites', {
        user_id: user.user_id,
        object_id: objectId
      });
      alert("Object saved to your terminal!");
    } catch (err) {
      console.error("Failed to save favorite.");
      alert("Error saving favorite. Is the backend running?");
    }
  };

  // 4. Filtering logic
  const filteredData = objects.filter(obj => 
    obj.name.toLowerCase().includes(filter.toLowerCase()) ||
    obj.type.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black text-purple-900 uppercase">Celestial Registry</h2>
          <p className="text-purple-400 text-[10px] font-bold uppercase tracking-[0.3em]">Mapping the Known Universe</p>
        </div>
        
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 size-4 text-purple-400" />
            <input 
              type="text" 
              placeholder="Search objects..."
              className="pl-10 pr-4 py-2 bg-white border border-purple-100 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none"
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredData.map((obj) => (
          <div key={obj.object_id} className="bg-white p-6 rounded-3xl border border-purple-50 shadow-sm hover:shadow-xl hover:border-purple-200 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-purple-50 rounded-2xl group-hover:bg-purple-600 transition-colors">
                <Globe className="size-6 text-purple-600 group-hover:text-white" />
              </div>
              <span className="text-[10px] font-black px-2 py-1 bg-slate-100 text-slate-500 rounded uppercase tracking-tighter">
                {obj.type}
              </span>
            </div>
            
            <h3 className="text-xl font-black text-slate-800 uppercase mb-1">{obj.name}</h3>
            <p className="text-xs text-slate-500 line-clamp-2 mb-4">
              {obj.description || "No mission data recorded for this sector yet."}
            </p>
            
            <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
              <div className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">
                ID: {obj.object_id}
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => toggleFavorite(obj.object_id)} 
                  className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                >
                  <Heart className="size-4" />
                </button>
                
                <button className="flex items-center gap-1 text-[10px] font-black text-purple-600 uppercase hover:text-purple-900 transition-colors">
                  <Info className="size-3" /> View Data
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CelestialObjects;