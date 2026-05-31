import { useState } from 'react';
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai';

function PasswordInput({ label, register, name, error, placeholder }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium text-slate-200">
        {label}
      </label>
      <div className="relative">
        <input
          id={name}
          type={visible ? 'text' : 'password'}
          placeholder={placeholder}
          {...register(name)}
          className="w-full rounded-3xl border border-slate-700/80 bg-slate-900/90 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan focus:ring-2 focus:ring-cyan/20"
          autoComplete={name === 'password' ? 'current-password' : 'new-password'}
        />
        <button
          type="button"
          onClick={() => setVisible((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-slate-400 transition hover:text-cyan"
          aria-label={visible ? 'Hide password' : 'Show password'}>
          {visible ? <AiFillEyeInvisible size={18} /> : <AiFillEye size={18} />}
        </button>
      </div>
      {error && <p className="text-sm text-rose-400">{error.message}</p>}
    </div>
  );
}

export default PasswordInput;
