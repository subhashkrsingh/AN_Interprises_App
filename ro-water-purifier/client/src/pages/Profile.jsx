import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth.js';

function Profile() {
  const { currentUser } = useAuth();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-[2rem] border border-slate-700/60 bg-slate-950/80 p-8 shadow-soft backdrop-blur-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan">Profile</p>
            <h1 className="mt-4 text-3xl font-semibold text-white">My account</h1>
          </div>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-3xl border border-slate-700/70 bg-slate-900/90 p-6">
            <p className="text-sm text-slate-400">Full name</p>
            <p className="mt-3 text-lg font-medium text-white">{currentUser?.fullName || 'Not provided'}</p>
          </div>
          <div className="rounded-3xl border border-slate-700/70 bg-slate-900/90 p-6">
            <p className="text-sm text-slate-400">Email</p>
            <p className="mt-3 text-lg font-medium text-white">{currentUser?.email || 'Not provided'}</p>
          </div>
          <div className="rounded-3xl border border-slate-700/70 bg-slate-900/90 p-6">
            <p className="text-sm text-slate-400">Role</p>
            <p className="mt-3 text-lg font-medium text-white">{currentUser?.role || 'User'}</p>
          </div>
          <div className="rounded-3xl border border-slate-700/70 bg-slate-900/90 p-6">
            <p className="text-sm text-slate-400">Username</p>
            <p className="mt-3 text-lg font-medium text-white">{currentUser?.username || 'Not provided'}</p>
          </div>
          <div className="rounded-3xl border border-slate-700/70 bg-slate-900/90 p-6">
            <p className="text-sm text-slate-400">Phone</p>
            <p className="mt-3 text-lg font-medium text-white">{currentUser?.mobile || 'Not provided'}</p>
          </div>
        </div>
      </motion.section>
    </div>
  );
}

export default Profile;
