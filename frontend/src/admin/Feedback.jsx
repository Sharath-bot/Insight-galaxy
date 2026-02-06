import React, { useEffect, useState } from 'react';
import API from '../api';
import { MessageSquare, UserCircle, Loader2, Trash2 } from 'lucide-react';

const Feedback = () => {
  const [inbox, setInbox] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/api/feedback')
      .then(res => { setInbox(res.data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, []);

  if (loading) return <div className="p-10 text-slate-400 font-mono flex items-center gap-2"><Loader2 className="animate-spin" /> SYNCING COMMS...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Communication Terminal</h2>
      
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-900 text-[10px] font-black text-cyan-400 uppercase tracking-widest">
            <tr>
              <th className="p-4">Pilot ID</th>
              <th className="p-4">Message Transmission</th>
              <th className="p-4">Timestamp</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {inbox.map((msg) => (
              <tr key={msg.feedback_id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                    <UserCircle className="size-4 text-slate-400" />
                    USER_{msg.user_id}
                  </div>
                </td>
                <td className="p-4 text-xs text-slate-600 italic leading-relaxed">
                   "{msg.comment}"
                </td>
                <td className="p-4 text-[10px] font-mono text-slate-400 uppercase">
                  {msg.created_at}
                </td>
                <td className="p-4 text-right">
                   <button className="p-2 text-slate-300 hover:text-red-500 transition-colors">
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

export default Feedback;