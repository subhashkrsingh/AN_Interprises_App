import { z } from 'zod';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,}$/;
const indianMobileRegex = /^[6-9]\d{9}$/;

export const loginSchema = z.object({
  identifier: z.string().trim().min(3, 'Email, username or phone is required'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  rememberMe: z.boolean().optional(),
});

export const registerSchema = z
  .object({
    fullName: z.string().trim().min(2, 'Full name is required'),
    email: z.string().trim().email('Enter a valid email address'),
    mobile: z.string().trim().regex(indianMobileRegex, 'Enter a valid 10-digit Indian mobile number'),
    username: z.string().trim().min(3, 'Username must be at least 3 characters'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .regex(passwordRegex, 'Password must include uppercase, lowercase, number and special character'),
    confirmPassword: z.string().min(8, 'Please confirm your password'),
    terms: z.literal(true, { errorMap: () => ({ message: 'You must accept terms and conditions' }) }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email('Enter a valid email address'),
});

export const calculatePasswordStrength = (password) => {
  const score = [/[A-Z]/, /[a-z]/, /\d/, /\W/].reduce(
    (count, test) => (test.test(password) ? count + 1 : count),
    0
  );

  if (password.length >= 12 && score === 4) return { label: 'Strong', value: 100, color: 'bg-emerald-400' };
  if (password.length >= 10 && score >= 3) return { label: 'Moderate', value: 70, color: 'bg-amber-400' };
  if (password.length >= 8) return { label: 'Weak', value: 40, color: 'bg-rose-400' };
  return { label: 'Very weak', value: 15, color: 'bg-red-500' };
};
