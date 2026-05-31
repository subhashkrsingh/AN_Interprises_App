import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, calculatePasswordStrength } from '../utils/validators.js';
import AuthLayout from '../components/AuthLayout.jsx';
import PasswordInput from '../components/PasswordInput.jsx';
import { useAuth } from '../hooks/useAuth.js';

function Register() {
  const navigate = useNavigate();
  const { register: authRegister, isAuthenticated } = useAuth();
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: '', email: '', mobile: '', username: '', password: '', confirmPassword: '', terms: false },
  });

  const passwordValue = watch('password');
  const strength = useMemo(() => calculatePasswordStrength(passwordValue || ''), [passwordValue]);

  if (isAuthenticated) {
    navigate('/dashboard');
  }

  const onSubmit = async (values) => {
    setServerError('');

    try {
      await authRegister(values);
      navigate('/dashboard');
    } catch (error) {
      setServerError(error?.response?.data?.message || 'Unable to create account. Please try again.');
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      description="Register with secure validation, strong password feedback, and a polished user onboarding experience."
      aside={
        <div className="space-y-3 rounded-3xl border border-slate-700/70 bg-slate-950/60 p-4 text-sm text-slate-300">
          <p className="font-semibold text-slate-100">Account setup</p>
          <p>Choose a strong password and accept terms to keep your profile secure.</p>
          <p>Staff and admin account roles are assigned by backend authorization.</p>
        </div>
      }>
      <div className="space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="fullName" className="block text-sm font-medium text-slate-200">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                placeholder="Jane Doe"
                {...register('fullName')}
                className="w-full rounded-3xl border border-slate-700/80 bg-slate-900/90 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan focus:ring-2 focus:ring-cyan/20"
              />
              {errors.fullName && <p className="text-sm text-rose-400">{errors.fullName.message}</p>}
            </div>

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
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="mobile" className="block text-sm font-medium text-slate-200">
                Mobile number
              </label>
              <input
                id="mobile"
                type="tel"
                placeholder="9876543210"
                {...register('mobile')}
                className="w-full rounded-3xl border border-slate-700/80 bg-slate-900/90 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan focus:ring-2 focus:ring-cyan/20"
              />
              {errors.mobile && <p className="text-sm text-rose-400">{errors.mobile.message}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-medium text-slate-200">
                Username
              </label>
              <input
                id="username"
                type="text"
                placeholder="john_doe"
                {...register('username')}
                className="w-full rounded-3xl border border-slate-700/80 bg-slate-900/90 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan focus:ring-2 focus:ring-cyan/20"
              />
              {errors.username && <p className="text-sm text-rose-400">{errors.username.message}</p>}
            </div>
          </div>

          <div className="space-y-5">
            <PasswordInput
              label="Password"
              name="password"
              placeholder="Create a strong password"
              register={register}
              error={errors.password}
            />
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-slate-300">
                <span>Password strength</span>
                <span className="font-semibold text-slate-100">{strength.label}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                <div className={`${strength.color} h-full transition-all`} style={{ width: `${strength.value}%` }} />
              </div>
            </div>
            <PasswordInput
              label="Confirm password"
              name="confirmPassword"
              placeholder="Repeat your password"
              register={register}
              error={errors.confirmPassword}
            />
          </div>

          <label className="inline-flex items-start gap-3 text-sm text-slate-300">
            <input type="checkbox" {...register('terms')} className="mt-1 h-4 w-4 rounded border-slate-600 bg-slate-900 text-cyan focus:ring-cyan" />
            <span>
              I agree to the <span className="font-semibold text-white">terms & conditions</span> and privacy policy.
            </span>
          </label>
          {errors.terms && <p className="text-sm text-rose-400">{errors.terms.message}</p>}

          {serverError && <p className="rounded-3xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{serverError}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-3xl bg-cyan px-5 py-3 text-sm font-semibold text-navy transition hover:bg-cyan/90 disabled:cursor-not-allowed disabled:opacity-60">
            {isSubmitting ? 'Creating account...' : 'Register and continue'}
          </button>
        </form>

        <div className="grid gap-3 sm:grid-cols-2">
          <button type="button" className="rounded-3xl border border-slate-700/80 bg-slate-900/90 px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-slate-800">
            Register with Google
          </button>
          <button type="button" className="rounded-3xl border border-slate-700/80 bg-slate-900/90 px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-slate-800">
            Register with GitHub
          </button>
        </div>

        <div className="rounded-3xl border border-slate-700/70 bg-slate-950/50 p-4 text-sm text-slate-300">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-cyan hover:text-white">
            Sign in
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}

export default Register;
