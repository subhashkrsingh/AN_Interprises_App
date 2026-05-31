import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService.js';
import PasswordInput from './PasswordInput.jsx';

const otpSchema = z.object({
  mobile: z.string().trim().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
  otp: z.string().trim().length(6, 'OTP must be 6 digits'),
});

function VerifyOTP() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [serverMessage, setServerMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm({ resolver: zodResolver(otpSchema) });

  useEffect(() => {
    const storedMobile = sessionStorage.getItem('otp_mobile');
    if (storedMobile) {
      setValue('mobile', storedMobile);
    }
  }, [setValue]);

  const onSubmit = async (values) => {
    setServerError('');
    setServerMessage('');
    setLoading(true);

    try {
      const response = await authService.verifyOtp(values);
      sessionStorage.removeItem('otp_mobile');
      setServerMessage('OTP verified successfully. Redirecting...');
      navigate('/dashboard');
    } catch (error) {
      setServerError(error?.response?.data?.message || 'OTP verification failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4 rounded-3xl border border-slate-700/70 bg-slate-950/90 p-6">
        <h2 className="text-2xl font-semibold text-white">Verify OTP</h2>
        <p className="text-sm text-slate-400">Enter the 6-digit code sent to your phone to continue.</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-3xl border border-slate-700/70 bg-slate-950/90 p-6">
        <div className="space-y-2">
          <label htmlFor="mobile" className="block text-sm font-medium text-slate-200">Mobile number</label>
          <input
            id="mobile"
            type="tel"
            placeholder="9876543210"
            {...register('mobile')}
            className="w-full rounded-3xl border border-slate-700/80 bg-slate-900/90 px-4 py-3 text-slate-100 outline-none focus:border-cyan focus:ring-2 focus:ring-cyan/20"
          />
          {errors.mobile && <p className="text-sm text-rose-400">{errors.mobile.message}</p>}
        </div>
        <div className="space-y-2">
          <label htmlFor="otp" className="block text-sm font-medium text-slate-200">OTP code</label>
          <input
            id="otp"
            type="text"
            maxLength={6}
            placeholder="123456"
            {...register('otp')}
            className="w-full rounded-3xl border border-slate-700/80 bg-slate-900/90 px-4 py-3 text-slate-100 outline-none focus:border-cyan focus:ring-2 focus:ring-cyan/20"
          />
          {errors.otp && <p className="text-sm text-rose-400">{errors.otp.message}</p>}
        </div>
        {serverError && <p className="rounded-3xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{serverError}</p>}
        {serverMessage && <p className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">{serverMessage}</p>}
        <button type="submit" disabled={loading} className="w-full rounded-3xl bg-cyan px-5 py-3 text-sm font-semibold text-navy transition hover:bg-cyan/90 disabled:opacity-60">
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>
      </form>
    </div>
  );
}

export default VerifyOTP;
