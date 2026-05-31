import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="border-t border-slate-700/50 bg-navy/95 px-5 py-10 text-slate-300 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[1.5fr,1fr,1fr]">
          <div>
            <h2 className="text-2xl font-semibold text-white">RO PureCare</h2>
            <p className="mt-4 max-w-md text-slate-400">
              Trusted RO purifier sales, installation, repair and maintenance for homes and commercial spaces.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <ul className="mt-4 space-y-3 text-slate-400">
              {['/', '/services', '/products', '/about', '/contact'].map((path) => (
                <li key={path}>
                  <Link to={path} className="transition hover:text-white">
                    {path === '/' ? 'Home' : path.replace('/', '').charAt(0).toUpperCase() + path.slice(2)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Contact</h3>
            <p className="mt-4 text-slate-400">Phone: +91 98765 43210</p>
            <p className="mt-2 text-slate-400">Email: support@ropurecare.com</p>
            <p className="mt-2 text-slate-400">123 Aqua Lane, Clean City</p>
          </div>
        </div>
        <div className="mt-10 border-t border-slate-700/50 pt-6 text-sm text-slate-500">
          © {new Date().getFullYear()} RO PureCare. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
