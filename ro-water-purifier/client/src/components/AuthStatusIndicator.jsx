function AuthStatusIndicator({ status = 'Active' }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 bg-slate-900/90 px-4 py-2 text-sm text-slate-200">
      <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
      {status}
    </span>
  );
}

export default AuthStatusIndicator;
