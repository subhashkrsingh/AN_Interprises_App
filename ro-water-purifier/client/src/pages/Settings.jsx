import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

function Settings() {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const saved = localStorage.getItem('theme') || 'dark';
    setTheme(saved);
    document.documentElement.classList.toggle('dark', saved === 'dark');
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('theme', next);
    document.documentElement.classList.toggle('dark', next === 'dark');
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-[2rem] border border-slate-700/60 bg-slate-950/80 p-8 shadow-soft backdrop-blur-xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan">Settings</p>
            <h1 className="mt-4 text-3xl font-semibold text-white">Preferences</h1>
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-3xl border border-slate-700/80 bg-slate-900/90 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-cyan hover:text-white">
            Switch to {theme === 'dark' ? 'light' : 'dark'} mode
          </button>
        </div>

        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="rounded-3xl border border-slate-700/70 bg-slate-900/90 p-6">
              <p className="text-sm text-slate-400">Theme preferences</p>
              <p className="mt-3 text-lg font-medium text-white">{theme === 'dark' ? 'Dark mode enabled' : 'Light mode enabled'}</p>
            </div>
            <div className="rounded-3xl border border-slate-700/70 bg-slate-900/90 p-6">
              <p className="text-sm text-slate-400">Security</p>
              <p className="mt-3 text-lg font-medium text-white">JWT session persistence</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.section>
    </div>
  );
}

export default Settings;
