import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from './api';
// ADDED Loader2 HERE
import { Rocket, ShieldCheck, User as ArrowLeft, Loader2 } from 'lucide-react';

const Login = ({ setUser }) => {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  
  // ADDED LOADING STATE HERE
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    full_name: '',
    email: '',
    role_id: 3 
  });

  const handleAction = async (e) => {
    e.preventDefault();
    setLoading(true); // START LOADING
    try {
      if (mode === 'login') {
        const res = await API.post('/login', { 
          username: formData.username, 
          password: formData.password 
        });

        if (res.data.success) {
          const userData = { 
            username: res.data.username, 
            role_id: res.data.role_id,
            user_id: res.data.user_id 
          };
          localStorage.setItem('insight_user', JSON.stringify(userData));
          setUser(userData);

          if (userData.role_id === 1) navigate('/admin');
          else if (userData.role_id === 2) navigate('/researcher');
          else navigate('/user');
        }
      } else if (mode === 'signup') {
        await API.post('/api/users', { 
          username: formData.username,
          password_hash: formData.password,
          full_name: formData.full_name,
          email: formData.email,
          role_id: formData.role_id
        });
        alert("Enlistment Successful! You may now log in.");
        setMode('login');
      }
    } catch (err) {
      console.error(err);
      alert("Mission Failed: Check your connection or credentials.");
    } finally {
      setLoading(false); // STOP LOADING
    }
  };

  const inputStyles = "w-full bg-slate-800/50 border border-slate-700 p-4 rounded-2xl text-white placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all";

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center overflow-hidden relative font-sans">
      
      {/* BACKGROUND ANIMATION */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 animate-pulse"></div>
      </div>

      {/* LOGIN CARD */}
      <div className="relative z-10 w-full max-w-md p-8 bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] shadow-2xl animate-in fade-in zoom-in duration-700">
        
        <div className="flex justify-center mb-8">
          <div className="p-4 bg-blue-600/20 rounded-full border border-blue-500/30 animate-float">
            <Rocket className="size-10 text-blue-400 fill-blue-400/20" />
          </div>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter">
            {mode === 'login' ? 'Insight Galaxy' : 'Join the Fleet'}
          </h1>
          <p className="text-slate-400 text-xs font-mono uppercase tracking-widest mt-2">
            Terminal Synchronization
          </p>
        </div>

        <form onSubmit={handleAction} className="space-y-4">
          {mode === 'signup' && (
            <>
              <input type="text" placeholder="FULL NAME" className={inputStyles} onChange={e => setFormData({...formData, full_name: e.target.value})} required />
              <input type="email" placeholder="EMAIL" className={inputStyles} onChange={e => setFormData({...formData, email: e.target.value})} required />
            </>
          )}

          <input type="text" placeholder="EXPLORER ID" className={inputStyles} onChange={e => setFormData({...formData, username: e.target.value})} required />
          <input type="password" placeholder="ACCESS CODE" className={inputStyles} onChange={e => setFormData({...formData, password: e.target.value})} required />

          {mode === 'signup' && (
            <select className={`${inputStyles} cursor-pointer`} onChange={e => setFormData({...formData, role_id: parseInt(e.target.value)})}>
              <option value="3" className="bg-slate-900">Explorer</option>
              <option value="2" className="bg-slate-900">Researcher</option>
              <option value="1" className="bg-slate-900">Admin</option>
            </select>
          )}
          
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg shadow-blue-600/20 disabled:opacity-50"
          >
            {/* THIS IS WHERE THE ERRORS WERE HAPPENING */}
            {loading ? <Loader2 className="animate-spin" /> : <ShieldCheck size={20} />}
            {mode === 'login' ? 'Initialize Synchronization' : 'Enlist Now'}
          </button>
        </form>

        <div className="mt-8 flex justify-between px-2">
          {mode === 'login' ? (
            <button onClick={() => setMode('signup')} className="text-blue-400 text-xs font-bold uppercase hover:underline">New Enlistment</button>
          ) : (
            <button onClick={() => setMode('login')} className="text-blue-400 text-xs font-bold uppercase flex items-center gap-2 hover:underline">
               <ArrowLeft size={14} /> Back to Terminal
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;