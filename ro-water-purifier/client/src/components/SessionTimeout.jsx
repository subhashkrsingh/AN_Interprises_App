import { useEffect, useState } from 'react';

function SessionTimeout({ warningSeconds = 60, onTimeout, onContinue, isActive = true }) {
  const [remaining, setRemaining] = useState(warningSeconds);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    if (!isActive) return undefined;
    const interval = setInterval(() => {
      setRemaining((value) => {
        if (value <= 1) {
          onTimeout();
          clearInterval(interval);
          return 0;
        }
        return value - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, onTimeout]);

  useEffect(() => {
    if (remaining <= warningSeconds && remaining > 0) {
      setShowWarning(true);
    }
  }, [remaining, warningSeconds]);

  if (!showWarning) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 py-5">
      <div className="w-full max-w-md rounded-3xl border border-slate-700/80 bg-slate-900/95 p-6 text-slate-100 shadow-soft backdrop-blur-xl">
        <h2 className="text-xl font-semibold text-white">Session expiring soon</h2>
        <p className="mt-3 text-sm text-slate-300">Your session will expire in {remaining} seconds due to inactivity.</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={onContinue} className="rounded-3xl border border-slate-700/80 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:border-cyan hover:text-white">
            Stay logged in
          </button>
          <button type="button" onClick={onTimeout} className="rounded-3xl bg-rose-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-400">
            Logout now
          </button>
        </div>
      </div>
    </div>
  );
}

export default SessionTimeout;
