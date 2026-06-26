import { motion } from 'framer-motion';

function AuthStatusIndicator({ status = 'Active' }) {
  const isActive = status === 'Active' || status === 'active';

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-sm"
    >
      <span className={`relative flex h-2.5 w-2.5 ${isActive ? 'bg-emerald-400' : 'bg-amber-400'}`}>
        <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${isActive ? 'bg-emerald-400' : 'bg-amber-400'} opacity-75`}></span>
      </span>
      <span className="font-medium text-slate-200">{status}</span>
    </motion.div>
  );
}

export default AuthStatusIndicator;