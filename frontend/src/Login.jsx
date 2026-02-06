import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from './api';
import { Rocket, ShieldCheck, User as ArrowLeft } from 'lucide-react';

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center overflow-hidden relative">
      
      {/* BACKGROUND ANIMATION: Moving Stars */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 animate-pulse"></div>
      </div>

      {/* LOGIN CARD */}
      <div className="relative z-10 w-full max-w-md p-8 bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] shadow-2xl animate-in fade-in zoom-in duration-700">
        
        {/* ANIMATED LOGO */}
        <div className="flex justify-center mb-8">
          <div className="p-4 bg-blue-600/20 rounded-full border border-blue-500/30 animate-float">
            <Rocket className="size-10 text-blue-400 fill-blue-400/20" />
          </div>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Insight Galaxy</h1>
          <p className="text-slate-400 text-xs font-mono uppercase tracking-widest mt-2">Secure Terminal Access</p>
        </div>

        <form className="space-y-4">
          <input 
            type="text" 
            placeholder="Explorer ID" 
            className="w-full bg-slate-800/50 border border-slate-700 p-4 rounded-2xl text-white placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
          <input 
            type="password" 
            placeholder="Access Code" 
            className="w-full bg-slate-800/50 border border-slate-700 p-4 rounded-2xl text-white placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
          
          <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg shadow-blue-600/20">
            <ShieldCheck size={20} />
            Initialize Synchronization
          </button>
        </form>
      </div>
    </div>
  );
};
const Login = ({ setUser }) => { // Ensure setUser is passed as a prop
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    full_name: '',
    email: '',
    role_id: 3 // Default to Explorer
  });

  const handleAction = async (e) => {
    e.preventDefault();
    try {
      if (mode === 'login') {
        const res = await API.post('/login', { 
          username: formData.username, 
          password: formData.password 
        });

        if (res.data.success) {
          // 1. CREATE THE USER OBJECT
          const userData = { 
            username: res.data.username, 
            role_id: res.data.role_id,
            user_id: res.data.user_id // Ensure backend sends this for 'Favorites'
          };

          // 2. LOCK INTO BROWSER MEMORY (Fixes Auto-Logout)
          localStorage.setItem('insight_user', JSON.stringify(userData));
          
          // 3. UPDATE STATE
          setUser(userData);

          // 4. DIRECT TO CORRECT PORTAL
          if (userData.role_id === 1) navigate('/admin');
          else if (userData.role_id === 2) navigate('/researcher');
          else navigate('/user');
        }
      } else if (mode === 'signup') {
        // Enlistment Logic
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
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden font-mono bg-black">
      <div className="stars-container"></div>
      <div className="twinkling"></div>

      <div className="relative z-10 w-full max-w-md p-8 m-4 bg-gray-900/90 backdrop-blur-xl border-2 border-cyan-500/30 rounded-3xl shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-white tracking-tighter">
            {mode === 'login' ? 'PILOT LOGIN' : mode === 'signup' ? 'ENLIST CADET' : 'RECOVER COMMS'}
          </h1>
          <p className="text-cyan-500 text-[10px] tracking-widest mt-1 uppercase">Insight Galaxy Terminal</p>
        </div>

        <form onSubmit={handleAction} className="space-y-4">
          {mode === 'signup' && (
            <>
              <input type="text" placeholder="FULL NAME" className={inputStyles} onChange={e => setFormData({...formData, full_name: e.target.value})} required />
              <input type="email" placeholder="EMAIL ADDRESS" className={inputStyles} onChange={e => setFormData({...formData, email: e.target.value})} required />
            </>
          )}
          
          <input type="text" placeholder="USERNAME" className={inputStyles} onChange={e => setFormData({...formData, username: e.target.value})} required />
          
          {mode !== 'reset' && (
            <input type="password" placeholder="ACCESS CODE" className={inputStyles} onChange={e => setFormData({...formData, password: e.target.value})} required />
          )}

          {mode === 'signup' && (
            <select className={`${inputStyles} text-cyan-400 cursor-pointer`} onChange={e => setFormData({...formData, role_id: parseInt(e.target.value)})}>
              <option value="3" className="bg-gray-900">Explorer (Emerald)</option>
              <option value="2" className="bg-gray-900">Researcher (Purple)</option>
              <option value="1" className="bg-gray-900">Admin (Slate)</option>
            </select>
          )}

          <button type="submit" className="w-full py-3 bg-cyan-600 hover:bg-cyan-400 text-black font-bold rounded-lg transition-all shadow-[0_0_15px_rgba(8,145,178,0.4)]">
            {mode === 'login' ? 'INITIALIZE' : mode === 'signup' ? 'REGISTER' : 'SEND RESET LINK'}
          </button>
        </form>

        <div className="mt-6 flex justify-between text-[11px] text-cyan-600 font-bold uppercase tracking-wider">
          {mode === 'login' ? (
            <>
              <button onClick={() => setMode('signup')} className="hover:text-cyan-300">New Enlistment</button>
              <button onClick={() => setMode('reset')} className="hover:text-cyan-300">Forgot Code?</button>
            </>
          ) : (
            <button onClick={() => setMode('login')} className="flex items-center hover:text-cyan-300">
              <ArrowLeft className="w-3 h-3 mr-1" /> Back to Hangar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const inputStyles = "w-full pl-4 pr-4 py-3 bg-black/60 border border-cyan-900/50 rounded-xl text-cyan-100 placeholder-cyan-900 focus:outline-none focus:border-cyan-400 transition-all";

export default Login;