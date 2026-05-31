import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const links = [
  { path: '/', label: 'Home' },
  { path: '/services', label: 'Services' },
  { path: '/products', label: 'Products' },
  { path: '/about', label: 'About' },
  { path: '/contact', label: 'Contact' },
];

function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-700/30 bg-navy/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-lg font-semibold text-white">
          RO PureCare
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition ${location.pathname === link.path ? 'text-cyan' : 'text-slate-300 hover:text-white'}`}>
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          onClick={() => setOpen((prev) => !prev)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-700 bg-white/5 text-slate-300 transition hover:border-cyan hover:text-cyan lg:hidden"
          aria-label="Toggle navigation">
          <span className="text-2xl">{open ? '✕' : '☰'}</span>
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-slate-700/50 bg-navy/95 px-5 pb-5">
          <div className="flex flex-col gap-3">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setOpen(false)}
                className={`rounded-2xl px-4 py-3 text-sm font-medium transition ${location.pathname === link.path ? 'bg-cyan/10 text-cyan' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
