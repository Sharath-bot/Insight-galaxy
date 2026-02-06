import React, { useEffect, useState } from 'react';
import API from '../api';
import { Search, Eye, Clock } from 'lucide-react';

const Observations = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    API.get('/api/observations').then(res => setLogs(res.data));
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Observation Telemetry</h2>
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <tr>
              <th className="p-4">Target ID</th>
              <th className="p-4">Timestamp</th>
              <th className="p-4">Findings</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {logs.map(log => (
              <tr key={log.observation_id} className="hover:bg-blue-50/30 transition-colors">
                <td className="p-4 font-mono font-bold text-blue-600">#{log.object_id}</td>
                <td className="p-4 text-slate-500">{log.observation_date}</td>
                <td className="p-4 text-slate-700 font-medium">{log.notes || "Standard scan complete."}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default Observations;