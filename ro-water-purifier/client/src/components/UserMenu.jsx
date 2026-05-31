import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserCircle } from 'react-icons/fa';

function UserMenu({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const initials = user?.fullName?.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'U';

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-950/85 px-4 py-2 text-sm text-slate-200 transition hover:border-cyan hover:text-white">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-cyan/10 text-cyan">
          {initials}
        </span>
        <span className="truncate max-w-[120px] text-left text-sm font-medium">{user.fullName || user.username}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="absolute right-0 z-50 mt-3 min-w-[220px] overflow-hidden rounded-3xl border border-slate-700/80 bg-slate-950/95 p-3 shadow-soft backdrop-blur-xl">
            <div className="space-y-2">
              <Link
                to="/dashboard"
                onClick={() => setOpen(false)}
                className="block rounded-2xl px-4 py-3 text-sm text-slate-200 transition hover:bg-white/5 hover:text-white">
                Dashboard
              </Link>
              <Link
                to="/profile"
                onClick={() => setOpen(false)}
                className="block rounded-2xl px-4 py-3 text-sm text-slate-200 transition hover:bg-white/5 hover:text-white">
                Profile
              </Link>
              <Link
                to="/settings"
                onClick={() => setOpen(false)}
                className="block rounded-2xl px-4 py-3 text-sm text-slate-200 transition hover:bg-white/5 hover:text-white">
                Settings
              </Link>
              {user.role === 'Admin' && (
                <Link
                  to="/admin"
                  onClick={() => setOpen(false)}
                  className="block rounded-2xl px-4 py-3 text-sm text-slate-200 transition hover:bg-white/5 hover:text-white">
                  Admin Panel
                </Link>
              )}
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  onLogout();
                }}
                className="w-full rounded-2xl bg-rose-500 px-4 py-3 text-left text-sm font-semibold text-white transition hover:bg-rose-400">
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default UserMenu;
