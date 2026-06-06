import { Alert, Box, Button, Link, Paper, Stack, TextField, Typography } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { Link as RouterLink } from 'react-router-dom';
import { useResetPasswordMutation } from '../../../features/api/adminApi.js';

export default function ResetPassword() {
  const [resetPassword, { isLoading, data, error }] = useResetPasswordMutation();
  const { control, handleSubmit } = useForm({ defaultValues: { token: '', password: '' } });

  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', bgcolor: 'background.default', p: 2 }}>
      <Paper sx={{ width: '100%', maxWidth: 440, p: 4 }}>
        <Stack spacing={3}>
          <Typography variant="h5">Reset Password</Typography>
          {data && <Alert severity="success">{data.message}</Alert>}
          {error && <Alert severity="error">{error.data?.message || 'Reset failed.'}</Alert>}
          <Stack component="form" spacing={2} onSubmit={handleSubmit((values) => resetPassword(values))}>
            <Controller name="token" control={control} rules={{ required: true }} render={({ field }) => <TextField {...field} label="Reset token" />} />
            <Controller name="password" control={control} rules={{ required: true }} render={({ field }) => <TextField {...field} label="New password" type="password" />} />
            <Button type="submit" variant="contained" disabled={isLoading}>
              Reset password
            </Button>
            <Link component={RouterLink} to="/admin/login" underline="hover">
              Back to login
            </Link>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}
