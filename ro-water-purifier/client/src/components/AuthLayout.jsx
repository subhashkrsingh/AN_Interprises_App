import { motion } from 'framer-motion';

function AuthLayout({ title, description, aside, children }) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(0,212,255,0.18),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.14),_transparent_30%),linear-gradient(180deg,_#04101f_0%,_#081925_100%)] text-slate-100">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-52 bg-gradient-to-b from-cyan/20 to-transparent blur-3xl" />
      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="grid w-full gap-10 rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 shadow-soft backdrop-blur-2xl sm:p-10 lg:grid-cols-[1.1fr_1fr]">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 rounded-full border border-cyan/25 bg-cyan/10 px-4 py-2 text-xs uppercase tracking-[0.26em] text-cyan">
              Secure SaaS access
            </div>
            <div className="space-y-4">
              <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                {title}
              </h1>
              <p className="max-w-xl text-slate-300">{description}</p>
            </div>
            {aside}
          </div>

          <div className="rounded-[2rem] border border-slate-700/60 bg-slate-950/90 p-8 shadow-soft backdrop-blur-xl sm:p-10">
            {children}
          </div>
        </motion.section>
      </div>
    </main>
  );
}

export default AuthLayout;
