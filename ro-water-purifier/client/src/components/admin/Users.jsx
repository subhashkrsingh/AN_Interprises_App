import { useEffect, useState } from 'react';
import { getAdminUsers } from '../../../services/auditService.js';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setError('');
      try {
        const response = await getAdminUsers();
        setUsers(response.users || []);
      } catch (err) {
        setError(err?.response?.data?.message || 'Unable to fetch users.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-slate-700/60 bg-slate-950/80 p-8 shadow-soft backdrop-blur-xl">
        <h1 className="text-3xl font-semibold text-white">User Management</h1>
        {loading ? (
          <p className="mt-6 text-slate-300">Loading users...</p>
        ) : error ? (
          <p className="mt-6 text-rose-400">{error}</p>
        ) : (
          <div className="mt-6 overflow-hidden rounded-3xl border border-slate-700/70 bg-slate-900/90">
            <table className="min-w-full text-left text-sm text-slate-200">
              <thead className="bg-slate-950/90 text-slate-400">
                <tr>
                  <th className="px-4 py-4">Name</th>
                  <th className="px-4 py-4">Email</th>
                  <th className="px-4 py-4">Mobile</th>
                  <th className="px-4 py-4">Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-t border-slate-800/60">
                    <td className="px-4 py-4 text-white">{user.fullName}</td>
                    <td className="px-4 py-4">{user.email}</td>
                    <td className="px-4 py-4">{user.mobile}</td>
                    <td className="px-4 py-4">{user.role}</td>
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

export default AdminUsers;
