import React, { useState, useEffect } from 'react';
import API from '../api';
import { Edit, Trash2, Plus, Save, X, Loader2 } from 'lucide-react';

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null); // Tracks which row is being edited
  const [editFormData, setEditFormData] = useState({ username: '', email: '' });

  // 1. READ: Fetch users from MySQL
  const fetchUsers = async () => {
    try {
      const res = await API.get('/api/users');
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch fleet personnel");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  // 2. DELETE: Remove from MySQL
  const handleDelete = async (id) => {
    if (window.confirm("Permanent Deletion: Are you sure?")) {
      await API.delete(`/api/users/${id}`);
      fetchUsers(); // Refresh list
    }
  };

  // 3. UPDATE: Save changes
  const handleEditClick = (user) => {
    setEditingId(user.user_id);
    setEditFormData({ username: user.username, email: user.email });
  };

  const handleSave = async (id) => {
    await API.put(`/api/users/${id}`, editFormData);
    setEditingId(null);
    fetchUsers();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <h2 className="font-black uppercase tracking-tighter text-slate-800">Personnel Records</h2>
        {/* CREATE BUTTON */}
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-blue-700 transition-all">
          <Plus size={16} /> Add New Cadet
        </button>
      </div>

      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50 text-[10px] uppercase tracking-widest text-slate-500 font-bold">
          <tr>
            <th className="p-4">Username</th>
            <th className="p-4">Email</th>
            <th className="p-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {users.map((user) => (
            <tr key={user.user_id} className="border-b border-slate-50 hover:bg-blue-50/30 transition-colors">
              <td className="p-4 font-medium">
                {editingId === user.user_id ? (
                  <input 
                    className="border p-1 rounded w-full" 
                    value={editFormData.username}
                    onChange={(e) => setEditFormData({...editFormData, username: e.target.value})}
                  />
                ) : user.username}
              </td>
              <td className="p-4 text-slate-600">
                {editingId === user.user_id ? (
                  <input 
                    className="border p-1 rounded w-full" 
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                  />
                ) : user.email}
              </td>
              <td className="p-4 flex justify-center gap-2">
                {editingId === user.user_id ? (
                  <>
                    <button onClick={() => handleSave(user.user_id)} className="text-green-600 p-1 hover:bg-green-50 rounded"><Save size={18}/></button>
                    <button onClick={() => setEditingId(null)} className="text-slate-400 p-1 hover:bg-slate-50 rounded"><X size={18}/></button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEditClick(user)} className="text-blue-500 p-1 hover:bg-blue-50 rounded"><Edit size={18}/></button>
                    <button onClick={() => handleDelete(user.user_id)} className="text-red-500 p-1 hover:bg-red-50 rounded"><Trash2 size={18}/></button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}