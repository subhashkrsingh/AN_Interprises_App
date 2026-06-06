import { Alert, Box, Button, Link, Paper, Stack, TextField, Typography } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { Link as RouterLink } from 'react-router-dom';
import { useForgotPasswordMutation } from '../../../features/api/adminApi.js';

export default function ForgotPassword() {
  const [forgotPassword, { isLoading, data, error }] = useForgotPasswordMutation();
  const { control, handleSubmit } = useForm({ defaultValues: { email: '' } });

  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', bgcolor: 'background.default', p: 2 }}>
      <Paper sx={{ width: '100%', maxWidth: 440, p: 4 }}>
        <Stack spacing={3}>
          <Typography variant="h5">Forgot Password</Typography>
          {data && <Alert severity="success">{data.message}</Alert>}
          {error && <Alert severity="error">{error.data?.message || 'Request failed.'}</Alert>}
          <Stack component="form" spacing={2} onSubmit={handleSubmit((values) => forgotPassword(values))}>
            <Controller
              name="email"
              control={control}
              rules={{ required: 'Email is required' }}
              render={({ field, fieldState }) => (
                <TextField {...field} label="Email" type="email" error={!!fieldState.error} helperText={fieldState.error?.message} />
              )}
            />
            <Button type="submit" variant="contained" disabled={isLoading}>
              Send reset token
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
