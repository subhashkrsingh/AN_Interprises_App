import { motion } from 'framer-motion';

function AuthLayout({ children, title, description, aside }) {
  return (
    <div className="min-h-screen bg-navy py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-[1.2fr,0.8fr] items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-[2rem] border border-slate-700/60 bg-slate-950/80 p-8 shadow-soft backdrop-blur-xl"
          >
            <div className="mb-8">
              <h1 className="text-3xl font-semibold text-white sm:text-4xl">{title}</h1>
              {description && <p className="mt-3 text-slate-300">{description}</p>}
            </div>
            {children}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
          >
            {aside}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;