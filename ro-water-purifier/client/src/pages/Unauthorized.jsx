import { Link } from 'react-router-dom';

function Unauthorized() {
  return (
    <div className="mx-auto flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl rounded-[2rem] border border-rose-400/20 bg-slate-950/90 p-10 text-center shadow-soft backdrop-blur-xl">
        <p className="text-sm uppercase tracking-[0.3em] text-rose-400">Access denied</p>
        <h1 className="mt-6 text-4xl font-semibold text-white">You don&apos;t have permissions</h1>
        <p className="mt-4 text-slate-300">This section is restricted to authorized users only. Please contact your administrator or return to your dashboard.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link to="/dashboard" className="rounded-3xl bg-cyan px-5 py-3 text-sm font-semibold text-navy transition hover:bg-cyan/90">
            Back to dashboard
          </Link>
          <Link to="/login" className="rounded-3xl border border-slate-700/80 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-cyan hover:text-white">
            Sign in again
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Unauthorized;
