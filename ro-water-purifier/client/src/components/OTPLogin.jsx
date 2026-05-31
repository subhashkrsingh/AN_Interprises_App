import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import authService from '../services/authService.js';

const mobileSchema = z.object({
  mobile: z.string().trim().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
});

function OTPLogin({ onOtpSent, setError, setLoading }) {
  const [message, setMessage] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(mobileSchema) });

  const onSubmit = async (values) => {
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await authService.sendOtp(values);
      setMessage(response.message || 'OTP sent successfully.');
      onOtpSent(values.mobile);
    } catch (error) {
      setError(error?.response?.data?.message || 'Unable to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
      {message && <p className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">{message}</p>}
      <button type="submit" className="w-full rounded-3xl bg-cyan px-5 py-3 text-sm font-semibold text-navy transition hover:bg-cyan/90">
        Send OTP
      </button>
    </form>
  );
}

export default OTPLogin;
