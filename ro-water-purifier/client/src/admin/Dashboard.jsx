import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

function AdminDashboard() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="rounded-[2rem] border border-slate-700/60 bg-slate-950/80 p-8 shadow-soft backdrop-blur-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan">Admin panel</p>
            <h1 className="mt-4 text-3xl font-semibold text-white">Control center</h1>
          </div>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Link to="/admin/users" className="rounded-3xl border border-slate-700/70 bg-slate-900/90 p-6 text-left transition hover:border-cyan">
            <p className="text-sm text-slate-400">User management</p>
            <p className="mt-3 text-xl font-semibold text-white">View and manage users</p>
          </Link>
          <Link to="/admin/logs" className="rounded-3xl border border-slate-700/70 bg-slate-900/90 p-6 text-left transition hover:border-cyan">
            <p className="text-sm text-slate-400">Audit logs</p>
            <p className="mt-3 text-xl font-semibold text-white">Review security events</p>
          </Link>
          <div className="rounded-3xl border border-slate-700/70 bg-slate-900/90 p-6 text-left">
            <p className="text-sm text-slate-400">Permissions</p>
            <p className="mt-3 text-xl font-semibold text-white">RBAC and role access</p>
          </div>
        </div>
      </motion.section>
    </div>
  );
}

export default AdminDashboard;
