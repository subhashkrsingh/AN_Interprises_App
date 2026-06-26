import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import UserMenu from './UserMenu.jsx';

const publicLinks = [
  { path: '/', label: 'Home' },
  { path: '/services', label: 'Services' },
  { path: '/products', label: 'Products' },
  { path: '/about', label: 'About' },
  { path: '/contact', label: 'Contact' },
];

const authLinks = [
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/profile', label: 'Profile' },
  { path: '/settings', label: 'Settings' },
];

function Navbar() {
  const [open, setOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const location = useLocation();
  const { isAuthenticated, currentUser, logout } = useAuth();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setDarkMode(savedTheme === 'dark');
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  const handleThemeToggle = () => {
    const nextTheme = darkMode ? 'light' : 'dark';
    setDarkMode(!darkMode);
    localStorage.setItem('theme', nextTheme);
    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-700/30 bg-navy/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-lg font-semibold text-white">
          RO PureCare
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {(isAuthenticated ? authLinks : publicLinks).map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition ${location.pathname === link.path ? 'text-cyan' : 'text-slate-300 hover:text-white'}`}>
              {link.label}
            </Link>
          ))}
          <button
            type="button"
            onClick={handleThemeToggle}
            className="rounded-full border border-slate-700/80 bg-white/5 px-3 py-2 text-sm text-slate-200 transition hover:border-cyan hover:text-cyan">
            {darkMode ? 'Light' : 'Dark'}
          </button>
          {isAuthenticated ? (
            <UserMenu user={currentUser} onLogout={logout} />
          ) : (
            <div className="hidden items-center gap-3 lg:flex">
              <Link
                to="/login"
                className="rounded-full border border-slate-700/80 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-cyan hover:text-white">
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-cyan px-4 py-2 text-sm font-medium text-navy transition hover:bg-cyan/90">
                Register
              </Link>
            </div>
          )}
        </nav>

        <div className="flex items-center gap-3 lg:hidden">
          <button
            type="button"
            onClick={handleThemeToggle}
            className="rounded-full border border-slate-700/80 bg-white/5 px-3 py-2 text-sm text-slate-200 transition hover:border-cyan hover:text-cyan">
            {darkMode ? '☀' : '🌙'}
          </button>
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-700 bg-white/5 text-slate-300 transition hover:border-cyan hover:text-cyan"
            aria-label="Toggle navigation">
            <span className="text-2xl">{open ? '✕' : '☰'}</span>
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-slate-700/50 bg-navy/95 px-5 pb-5">
          <div className="flex flex-col gap-3">
            {(isAuthenticated ? authLinks : publicLinks).map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setOpen(false)}
                className={`rounded-2xl px-4 py-3 text-sm font-medium transition ${location.pathname === link.path ? 'bg-cyan/10 text-cyan' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}>
                {link.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white">
                  Account menu
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    logout();
                  }}
                  className="rounded-2xl bg-rose-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-400">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white">
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setOpen(false)}
                  className="rounded-2xl bg-cyan px-4 py-3 text-sm font-semibold text-navy transition hover:bg-cyan/90">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
