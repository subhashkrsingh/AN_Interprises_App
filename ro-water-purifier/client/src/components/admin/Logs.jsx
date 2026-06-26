import { useEffect, useState } from 'react';
import { getAuditLogs } from '../../../services/auditService.js';

function AdminLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setError('');
      try {
        const response = await getAuditLogs();
        setLogs(response.logs || []);
      } catch (err) {
        setError(err?.response?.data?.message || 'Unable to fetch audit logs.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-slate-700/60 bg-slate-950/80 p-8 shadow-soft backdrop-blur-xl">
        <h1 className="text-3xl font-semibold text-white">Audit Logs</h1>
        {loading ? (
          <p className="mt-6 text-slate-300">Loading logs...</p>
        ) : error ? (
          <p className="mt-6 text-rose-400">{error}</p>
        ) : (
          <div className="mt-6 overflow-hidden rounded-3xl border border-slate-700/70 bg-slate-900/90">
            <table className="min-w-full text-left text-sm text-slate-200">
              <thead className="bg-slate-950/90 text-slate-400">
                <tr>
                  <th className="px-4 py-4">Action</th>
                  <th className="px-4 py-4">User</th>
                  <th className="px-4 py-4">IP</th>
                  <th className="px-4 py-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log._id} className="border-t border-slate-800/60">
                    <td className="px-4 py-4 text-white">{log.action}</td>
                    <td className="px-4 py-4">{log.userId || 'System'}</td>
                    <td className="px-4 py-4">{log.ipAddress}</td>
                    <td className="px-4 py-4">{new Date(log.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminLogs;
