import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { loginSchema } from '../utils/validators.js';
import AuthLayout from '../components/AuthLayout.jsx';
import PasswordInput from '../components/PasswordInput.jsx';
import { useAuth } from '../hooks/useAuth.js';
import GoogleLoginButton from '../components/GoogleLoginButton.jsx';

function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const { oauthLogin } = useAuth();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: '', password: '', rememberMe: true },
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (values) => {
    setServerError('');

    try {
      await login({ identifier: values.identifier, password: values.password }, values.rememberMe);
      navigate('/dashboard');
    } catch (error) {
      setServerError(error?.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      description="Sign in to your account securely and continue managing your dashboard in a professional SaaS environment."
      aside={
        <div className="space-y-2 rounded-3xl border border-slate-700/70 bg-slate-950/60 p-4 text-sm text-slate-300">
          <p className="font-semibold text-slate-100">Login hints</p>
          <p>Use your email, username, or mobile number to sign in.</p>
          <p>Social login buttons are placeholders for Google and GitHub integration.</p>
        </div>
      }>
      <div className="space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-4">
            <div>
              <label htmlFor="identifier" className="block text-sm font-medium text-slate-200">
                Email or username
              </label>
              <input
                id="identifier"
                type="text"
                placeholder="you@example.com or john_doe"
                {...register('identifier')}
                className="w-full rounded-3xl border border-slate-700/80 bg-slate-900/90 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan focus:ring-2 focus:ring-cyan/20"
              />
              {errors.identifier && <p className="mt-2 text-sm text-rose-400">{errors.identifier.message}</p>}
            </div>

            <PasswordInput
              label="Password"
              name="password"
              placeholder="Enter your password"
              register={register}
              error={errors.password}
            />
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <label className="inline-flex items-center gap-2 text-sm text-slate-300">
              <input type="checkbox" {...register('rememberMe')} className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-cyan focus:ring-cyan" />
              Remember me
            </label>
            <Link to="/forgot-password" className="text-sm font-medium text-cyan transition hover:text-white">
              Forgot password?
            </Link>
          </div>

          {serverError && <p className="rounded-3xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{serverError}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-3xl bg-cyan px-5 py-3 text-sm font-semibold text-navy transition hover:bg-cyan/90 disabled:cursor-not-allowed disabled:opacity-60">
            {isSubmitting ? 'Signing in...' : 'Login to your account'}
          </button>
        </form>

        <div className="grid gap-3 sm:grid-cols-1">
          <GoogleLoginButton
            setLoading={() => {}}
            setError={() => {}}
            onSuccess={(data) => {
              oauthLogin(data, true);
              navigate('/dashboard');
            }}
          />
        </div>

        <div className="rounded-3xl border border-slate-700/70 bg-slate-950/50 p-4 text-sm text-slate-300">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-semibold text-cyan hover:text-white">
            Create one now
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}

export default Login;
