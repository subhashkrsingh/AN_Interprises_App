import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import AuthStatusIndicator from '../components/AuthStatusIndicator.jsx';

function Dashboard() {
  const { currentUser } = useAuth();

  const loginTime =
    localStorage.getItem('auth_last_login') ||
    sessionStorage.getItem('auth_last_login') ||
    new Date().toISOString();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <section className="rounded-[2rem] border border-slate-700/60 bg-slate-950/80 p-8 shadow-soft backdrop-blur-xl">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-cyan">Account dashboard</p>
              <h1 className="mt-4 text-3xl font-semibold text-white">Welcome back, {currentUser?.fullName || currentUser?.username}</h1>
            </div>
            <AuthStatusIndicator status="Active" />
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="rounded-3xl border border-slate-700/70 bg-slate-900/90 p-6">
              <p className="text-sm text-slate-400">Your role</p>
              <p className="mt-3 text-2xl font-semibold text-white">{currentUser?.role || 'User'}</p>
            </div>
            <div className="rounded-3xl border border-slate-700/70 bg-slate-900/90 p-6">
              <p className="text-sm text-slate-400">Account status</p>
              <p className="mt-3 text-2xl font-semibold text-white">Verified</p>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <div className="rounded-3xl border border-slate-700/70 bg-slate-900/90 p-6">
              <p className="text-sm text-slate-400">Email</p>
              <p className="mt-2 text-lg font-medium text-white">{currentUser?.email || 'Not available'}</p>
            </div>
            <div className="rounded-3xl border border-slate-700/70 bg-slate-900/90 p-6">
              <p className="text-sm text-slate-400">Username</p>
              <p className="mt-2 text-lg font-medium text-white">{currentUser?.username || 'Not available'}</p>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-700/60 bg-slate-950/80 p-8 shadow-soft backdrop-blur-xl">
          <div className="space-y-6">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-cyan">Session details</p>
              <h2 className="mt-4 text-2xl font-semibold text-white">Recent activity</h2>
            </div>

            <div className="space-y-4">
              <div className="rounded-3xl border border-slate-700/70 bg-slate-900/90 p-5">
                <p className="text-sm text-slate-400">Last login</p>
                <p className="mt-2 text-lg font-medium text-white">{new Date(loginTime).toLocaleString()}</p>
              </div>
              <div className="rounded-3xl border border-slate-700/70 bg-slate-900/90 p-5">
                <p className="text-sm text-slate-400">Connected device</p>
                <p className="mt-2 text-lg font-medium text-white">Browser session</p>
              </div>
            </div>
          </div>
        </section>
      </motion.div>
    </div>
  );
}

export default Dashboard;
