import React, { useEffect, useState } from 'react';
import API from '../api';
import { Search as SearchIcon, FileText, Database, Layers } from 'lucide-react';

const Observations = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await API.get('/api/observations');
        setLogs(res.data);
      } catch (err) {
        console.error("Telemetry error: Observations unreachable.");
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <h2 className="text-2xl font-black text-purple-900 uppercase">Observation Logs</h2>
      
      <div className="bg-white rounded-3xl border border-purple-50 shadow-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-purple-900 text-white text-[10px] uppercase tracking-[0.2em]">
            <tr>
              <th className="px-6 py-4">Obs ID</th>
              <th className="px-6 py-4">Target (Object ID)</th>
              <th className="px-6 py-4">Telescope</th>
              <th className="px-6 py-4">Instrument</th>
              <th className="px-6 py-4">Notes</th>
            </tr>
          </thead>
          <tbody className="text-xs font-bold divide-y divide-purple-50">
            {logs.map((log) => (
              <tr key={log.observation_id} className="hover:bg-purple-50 transition-colors">
                <td className="px-6 py-4 text-purple-600 font-mono">#{log.observation_id}</td>
                <td className="px-6 py-4 flex items-center gap-2">
                   <Layers className="size-3 text-slate-400" /> {log.object_id}
                </td>
                <td className="px-6 py-4 text-slate-500">{log.telescope_id}</td>
                <td className="px-6 py-4 text-slate-500">{log.instrument_id || 'N/A'}</td>
                <td className="px-6 py-4 text-slate-400 italic font-medium truncate max-w-[200px]">
                  {log.notes || 'Routine scan...'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Observations;