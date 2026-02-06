import React, { useEffect, useState } from 'react';
import API from '../api';
import { Users, Trash2, Shield, Mail, Loader2 } from 'lucide-react';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
   const handleAddUser = async (newUserData) => {
    try {
      // Sends data to your Python Universal POST route
      await API.post('/api/users', newUserData); 
      alert("New Cadet synchronized with central database.");
      
      // Re-fetch the list so the new user appears in the table
      const res = await API.get('/api/users');
      setUsers(res.data);
    } catch (err) {
      console.error("Transmission failed. Check backend connection.");
    }
  };
  // 1. Fetch Users from Database
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await API.get('/api/users');
        setUsers(response.data);
      } catch (err) {
        console.error("Transmission Interrupted: Could not retrieve personnel logs.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // 2. Delete User Logic
  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to decommission this personnel file?")) return;
    try {
      await API.delete(`/api/users/${id}`);
      setUsers(users.filter(user => user.user_id !== id));
      alert("Personnel record removed.");
    } catch (err) {
      alert("Override failed: Check backend permissions.");
    }
  };

  if (loading) return (
    <div className="flex items-center gap-2 p-10 text-slate-400 font-mono">
      <Loader2 className="animate-spin size-4" /> SECURE LINK ESTABLISHING...
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Personnel Registry</h2>
          <p className="text-slate-400 text-xs font-mono uppercase">Authorized personnel only beyond this sector</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Identification</th>
              <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Access Level</th>
              <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Contact Signal</th>
              <th className="p-4 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((user) => (
              <tr key={user.user_id} className="hover:bg-slate-50 transition-colors group">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                      <Users className="size-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{user.username}</div>
                      <div className="text-[10px] text-slate-400 font-mono uppercase">UID: {user.user_id}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-tighter ${
                    user.role_id === 1 ? 'bg-slate-900 text-white' : 
                    user.role_id === 2 ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {user.role_id === 1 ? 'Admin' : user.role_id === 2 ? 'Researcher' : 'Explorer'}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Mail className="size-3" /> {user.email}
                  </div>
                </td>
                <td className="p-4 text-right">
                  <button 
                    onClick={() => deleteUser(user.user_id)}
                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;