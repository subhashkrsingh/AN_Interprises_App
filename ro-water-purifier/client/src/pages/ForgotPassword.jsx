import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema } from '../utils/validators.js';
import AuthLayout from '../components/AuthLayout.jsx';
import { useAuth } from '../hooks/useAuth.js';

function ForgotPassword() {
  const navigate = useNavigate();
  const { forgotPassword, isAuthenticated } = useAuth();
  const [serverMessage, setServerMessage] = useState('');
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  if (isAuthenticated) {
    navigate('/dashboard');
  }

  const onSubmit = async ({ email }) => {
    setServerMessage('');
    setServerError('');

    try {
      const response = await forgotPassword({ email });
      setServerMessage(response?.message || 'If your email exists, a reset link has been sent.');
    } catch (error) {
      setServerError(error?.response?.data?.message || 'Unable to send reset instructions.');
    }
  };

  return (
    <AuthLayout
      title="Forgot password"
      description="Enter your email address and we&apos;ll send you instructions to reset your password securely."
      aside={
        <div className="space-y-2 rounded-3xl border border-slate-700/70 bg-slate-950/60 p-4 text-sm text-slate-300">
          <p className="font-semibold text-slate-100">Password recovery</p>
          <p>We send a secure reset link if your account is recognized.</p>
          <p>If you remember your password, go back to login.</p>
        </div>
      }>
      <div className="space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-slate-200">
              Email address
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register('email')}
              className="w-full rounded-3xl border border-slate-700/80 bg-slate-900/90 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan focus:ring-2 focus:ring-cyan/20"
            />
            {errors.email && <p className="text-sm text-rose-400">{errors.email.message}</p>}
          </div>

          {serverMessage && <p className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">{serverMessage}</p>}
          {serverError && <p className="rounded-3xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{serverError}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-3xl bg-cyan px-5 py-3 text-sm font-semibold text-navy transition hover:bg-cyan/90 disabled:cursor-not-allowed disabled:opacity-60">
            {isSubmitting ? 'Sending reset link...' : 'Send reset instructions'}
          </button>
        </form>

        <div className="rounded-3xl border border-slate-700/70 bg-slate-950/50 p-4 text-sm text-slate-300">
          Remembered your password?{' '}
          <Link to="/login" className="font-semibold text-cyan hover:text-white">
            Sign in again
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}

export default ForgotPassword;
