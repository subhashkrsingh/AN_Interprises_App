import { motion } from 'framer-motion';

function Admin() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-[2rem] border border-slate-700/60 bg-slate-950/80 p-8 shadow-soft backdrop-blur-xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan">Admin panel</p>
            <h1 className="mt-4 text-3xl font-semibold text-white">Administrative access</h1>
          </div>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div className="rounded-3xl border border-slate-700/70 bg-slate-900/90 p-6">
            <p className="text-sm text-slate-400">User management</p>
            <p className="mt-3 text-lg font-medium text-white">Access user and staff controls.</p>
          </div>
          <div className="rounded-3xl border border-slate-700/70 bg-slate-900/90 p-6">
            <p className="text-sm text-slate-400">System overview</p>
            <p className="mt-3 text-lg font-medium text-white">View sensitive admin features securely.</p>
          </div>
        </div>
      </motion.section>
    </div>
  );
}

export default Admin;
