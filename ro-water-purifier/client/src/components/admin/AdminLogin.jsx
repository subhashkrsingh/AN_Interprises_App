import { Alert, Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Link, Paper, Stack, TextField, Typography } from '@mui/material';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { Link as RouterLink, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../../features/auth/authSlice.js';

const loginSchema = z.object({
  email: z.string().email('Enter a valid admin email.'),
  password: z.string().min(1, 'Password is required.'),
  remember: z.boolean(),
});

const twoFactorSchema = z.object({
  code: z.string().regex(/^\d{6}$/, 'Enter the 6 digit code.'),
});

export default function AdminLogin() {
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [challenge, setChallenge] = useState(null);
  const [verifyLoading, setVerifyLoading] = useState(false);

  const { control, handleSubmit } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: 'admin@example.com', password: 'Admin@123', remember: true },
  });
  const twoFactorForm = useForm({
    resolver: zodResolver(twoFactorSchema),
    defaultValues: { code: '' },
  });

  if (token) return <Navigate to="/admin/dashboard" replace />;

  const onSubmit = async (values) => {
    setLoading(true);
    setError('');
    
    try {
      // Simulate login - replace with actual API call
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: {
              token: 'mock-admin-token-12345',
              user: {
                id: 1,
                name: 'Admin User',
                email: values.email,
                roles: ['super_admin'],
                isAdmin: true,
              }
            }
          });
        }, 1000);
      });
      
      dispatch(setCredentials({
        token: response.data.token,
        user: response.data.user,
      }));
      navigate(location.state?.from?.pathname || '/admin/dashboard', { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const onVerifyTwoFactor = async (values) => {
    setVerifyLoading(true);
    try {
      // Simulate 2FA verification
      await new Promise((resolve) => setTimeout(resolve, 1000));
      navigate(location.state?.from?.pathname || '/admin/dashboard', { replace: true });
    } catch (err) {
      // Handle error
    } finally {
      setVerifyLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', bgcolor: 'background.default', p: 2 }}>
      <Paper sx={{ width: '100%', maxWidth: 440, p: { xs: 3, md: 4 }, borderRadius: 2 }}>
        <Stack spacing={3}>
          <Stack spacing={1} alignItems="center">
            <Box sx={{ 
              display: 'grid', 
              placeItems: 'center', 
              width: 56, 
              height: 56, 
              borderRadius: 2, 
              bgcolor: 'primary.main', 
              color: 'primary.contrastText' 
            }}>
              <LockRoundedIcon />
            </Box>
            <Typography variant="h5">RO Admin Login</Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              Secure access for sales, service, AMC, inventory and support teams.
            </Typography>
          </Stack>

          {error && <Alert severity="error">{error}</Alert>}

          <Stack component="form" spacing={2.2} onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="email"
              control={control}
              rules={{ required: 'Email is required' }}
              render={({ field, fieldState }) => (
                <TextField 
                  {...field} 
                  label="Email" 
                  type="email" 
                  error={!!fieldState.error} 
                  helperText={fieldState.error?.message} 
                  fullWidth 
                />
              )}
            />
            <Controller
              name="password"
              control={control}
              rules={{ required: 'Password is required' }}
              render={({ field, fieldState }) => (
                <TextField 
                  {...field} 
                  label="Password" 
                  type="password" 
                  error={!!fieldState.error} 
                  helperText={fieldState.error?.message} 
                  fullWidth 
                />
              )}
            />
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Controller
                name="remember"
                control={control}
                render={({ field }) => (
                  <FormControlLabel 
                    control={<Checkbox checked={field.value} onChange={(event) => field.onChange(event.target.checked)} />} 
                    label="Remember me" 
                  />
                )}
              />
              <Link component={RouterLink} to="/admin/forgot-password" underline="hover">
                Forgot password
              </Link>
            </Stack>
            <Button type="submit" variant="contained" size="large" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </Stack>
        </Stack>
      </Paper>

      <Dialog open={Boolean(challenge)} onClose={() => setChallenge(null)} fullWidth maxWidth="xs">
        <DialogTitle>Two-factor verification</DialogTitle>
        <DialogContent>
          <Stack component="form" id="two-factor-form" spacing={2} sx={{ pt: 1 }} onSubmit={twoFactorForm.handleSubmit(onVerifyTwoFactor)}>
            <Typography variant="body2" color="text.secondary">
              Enter the verification code sent to {challenge?.email}.
            </Typography>
            <Controller
              name="code"
              control={twoFactorForm.control}
              render={({ field, fieldState }) => (
                <TextField 
                  {...field} 
                  label="Verification code" 
                  error={!!fieldState.error} 
                  helperText={fieldState.error?.message} 
                  fullWidth 
                />
              )}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setChallenge(null)}>Cancel</Button>
          <Button type="submit" form="two-factor-form" variant="contained" disabled={verifyLoading}>
            {verifyLoading ? 'Verifying...' : 'Verify'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}