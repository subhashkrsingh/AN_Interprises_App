import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import AuthLayout from '../components/AuthLayout.jsx';
import PasswordInput from '../components/PasswordInput.jsx';
import { useAuth } from "../context/AuthContext";
// import GoogleLoginButton from '../components/GoogleLoginButton.jsx';

// Password strength calculator
const calculatePasswordStrength = (password) => {
  if (!password) return { value: 0, label: 'None', color: 'bg-slate-600' };
  let score = 0;
  if (password.length >= 8) score += 25;
  if (password.length >= 12) score += 15;
  if (/[a-z]/.test(password)) score += 20;
  if (/[A-Z]/.test(password)) score += 20;
  if (/[0-9]/.test(password)) score += 10;
  if (/[^a-zA-Z0-9]/.test(password)) score += 10;
  if (score > 100) score = 100;
  
  let label = 'Weak';
  let color = 'bg-rose-500';
  if (score >= 80) { label = 'Strong'; color = 'bg-emerald-500'; }
  else if (score >= 60) { label = 'Good'; color = 'bg-amber-500'; }
  else if (score >= 40) { label = 'Fair'; color = 'bg-cyan-500'; }
  
  return { value: score, label, color };
};

const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Please enter a valid email'),
  mobile: z.string().optional(),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  terms: z.boolean().refine(val => val === true, 'You must accept the terms'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

function Register() {
  const navigate = useNavigate();
  const { register: authRegister, isAuthenticated, loading, error, setError } = useAuth();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      mobile: '',
      username: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
  });

  const passwordValue = watch('password');
  const strength = useMemo(() => calculatePasswordStrength(passwordValue || ''), [passwordValue]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (values) => {
    setServerError('');
    setError(null);
    try {
      await authRegister(values);
      navigate('/dashboard');
    } catch (err) {
      setServerError(err.message || 'Unable to create account. Please try again.');
    }
  };

  if (isAuthenticated) {
    navigate('/dashboard');
    return null;
  }

  return (
    <AuthLayout
      title="Create your account"
      description="Register with secure validation, strong password feedback, and a polished user onboarding experience."
      aside={
        <div className="space-y-3 rounded-3xl border border-slate-700/70 bg-slate-950/60 p-4 text-sm text-slate-300">
          <p className="font-semibold text-slate-100">Account setup</p>
          <p>Choose a strong password and accept terms to keep your profile secure.</p>
          <p className="text-xs text-slate-400">Demo: Use any valid data to register</p>
        </div>
      }
    >
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
                placeholder="abhijitpancholi722@gmail.com"
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
                placeholder="7987089890"
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

          {(serverError || error) && (
            <p className="rounded-3xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {serverError || error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting || loading}
            className="w-full rounded-3xl bg-cyan px-5 py-3 text-sm font-semibold text-navy transition hover:bg-cyan/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting || loading ? 'Creating account...' : 'Register and continue'}
          </button>
        </form>

        <div className="grid gap-3 sm:grid-cols-1">
          {/* <GoogleLoginButton
            setLoading={() => {}}
            setError={() => {}}
            onSuccess={(data) => {
              // Handle Google login
            }}
          /> */}
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