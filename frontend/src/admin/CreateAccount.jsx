import React, { useState } from 'react';
import API from '../api';
import { UserPlus, Shield, Globe, Mail, User } from 'lucide-react';

const CreateAccount = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '', // Plain-text as requested
    email: '',
    full_name: '',
    role_id: 3, // Default to Explorer
    status: 'active'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Direct CRUD POST to the users table via the universal API [cite: 1-9]
      await API.post('/api/users', {
        ...formData,
        password_hash: formData.password // Maps to your schema column name [cite: 4]
      });
      alert(`Cadet ${formData.username} has been successfully enlisted!`);
    } catch (err) {
      alert("Enlistment Failed: Check database connection.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-blue-600 rounded-2xl">
            <UserPlus className="text-white size-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 uppercase">Register New Cadet</h2>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Personnel Management System</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 size-4 text-slate-400" />
              <input 
                type="text" 
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                required 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 size-4 text-slate-400" />
              <input 
                type="email" 
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Username</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              required 
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Initial Access Code</label>
            <input 
              type="password" 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required 
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Assigned Role</label>
            <div className="relative">
              <Shield className="absolute left-3 top-3 size-4 text-slate-400" />
              <select 
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl appearance-none focus:ring-2 focus:ring-blue-500 outline-none"
                onChange={(e) => setFormData({...formData, role_id: parseInt(e.target.value)})}
              >
                <option value="3">Explorer (Emerald Portal)</option>
                <option value="2">Researcher (Purple Portal)</option>
                <option value="1">Administrator (Slate Portal)</option>
              </select>
            </div>
          </div>

          <button 
            type="submit"
            className="md:col-span-2 mt-4 py-4 bg-slate-900 hover:bg-blue-600 text-white font-bold rounded-2xl uppercase tracking-widest transition-all duration-300 shadow-lg shadow-blue-500/20"
          >
            Authorize Personnel
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAccount;