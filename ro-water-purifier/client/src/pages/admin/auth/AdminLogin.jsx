import { Alert, Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Link, Paper, Stack, TextField, Typography } from '@mui/material';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { Link as RouterLink, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useLoginMutation, useVerifyTwoFactorMutation } from '../../../features/api/adminApi.js';

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
  const location = useLocation();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState(null);
  const [login, { isLoading, error }] = useLoginMutation();
  const [verifyTwoFactor, verifyState] = useVerifyTwoFactorMutation();
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: 'superadmin@example.com', password: 'Admin@12345', remember: true },
  });
  const twoFactorForm = useForm({
    resolver: zodResolver(twoFactorSchema),
    defaultValues: { code: '' },
  });

  if (token) return <Navigate to="/admin/dashboard" replace />;

  const onSubmit = async (values) => {
    const result = await login(values).unwrap();
    if (result.data?.requiresTwoFactor) {
      setChallenge({ ...result.data, remember: values.remember });
      return;
    }
    navigate(location.state?.from?.pathname || '/admin/dashboard', { replace: true });
  };

  const onVerifyTwoFactor = async (values) => {
    await verifyTwoFactor({ challengeId: challenge.challengeId, code: values.code, remember: challenge.remember }).unwrap();
    navigate(location.state?.from?.pathname || '/admin/dashboard', { replace: true });
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', bgcolor: 'background.default', p: 2 }}>
      <Paper sx={{ width: '100%', maxWidth: 440, p: { xs: 3, md: 4 }, borderRadius: 2 }}>
        <Stack spacing={3}>
          <Stack spacing={1} alignItems="center">
            <Box sx={{ display: 'grid', placeItems: 'center', width: 56, height: 56, borderRadius: 2, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
              <LockRoundedIcon />
            </Box>
            <Typography variant="h5">RO Admin Login</Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              Secure access for sales, service, AMC, inventory and support teams.
            </Typography>
          </Stack>

          {error && <Alert severity="error">{error.data?.message || 'Login failed.'}</Alert>}

          <Stack component="form" spacing={2.2} onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="email"
              control={control}
              rules={{ required: 'Email is required' }}
              render={({ field, fieldState }) => (
                <TextField {...field} label="Email" type="email" error={!!fieldState.error} helperText={fieldState.error?.message} fullWidth />
              )}
            />
            <Controller
              name="password"
              control={control}
              rules={{ required: 'Password is required' }}
              render={({ field, fieldState }) => (
                <TextField {...field} label="Password" type="password" error={!!fieldState.error} helperText={fieldState.error?.message} fullWidth />
              )}
            />
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Controller
                name="remember"
                control={control}
                render={({ field }) => (
                  <FormControlLabel control={<Checkbox checked={field.value} onChange={(event) => field.onChange(event.target.checked)} />} label="Remember me" />
                )}
              />
              <Link component={RouterLink} to="/admin/forgot-password" underline="hover">
                Forgot password
              </Link>
            </Stack>
            <Button type="submit" variant="contained" size="large" disabled={isLoading}>
              Sign in
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
            {challenge?.code && <Alert severity="info">Development code: {challenge.code}</Alert>}
            {verifyState.error && <Alert severity="error">{verifyState.error.data?.message || 'Verification failed.'}</Alert>}
            <Controller
              name="code"
              control={twoFactorForm.control}
              render={({ field, fieldState }) => (
                <TextField {...field} label="Verification code" error={!!fieldState.error} helperText={fieldState.error?.message} fullWidth />
              )}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setChallenge(null)}>Cancel</Button>
          <Button type="submit" form="two-factor-form" variant="contained" disabled={verifyState.isLoading}>
            Verify
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
