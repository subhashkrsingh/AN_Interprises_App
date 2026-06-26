import { Alert, Box, Button, Link, Paper, Stack, TextField, Typography } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { Link as RouterLink } from 'react-router-dom';
import { useState } from 'react';

export default function ResetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const { control, handleSubmit } = useForm({ defaultValues: { token: '', password: '', confirmPassword: '' } });

  const onSubmit = async (values) => {
    setIsLoading(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setData({ message: 'Password reset successfully!' });
    } catch (err) {
      setError({ data: { message: 'Reset failed.' } });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', bgcolor: 'background.default', p: 2 }}>
      <Paper sx={{ width: '100%', maxWidth: 440, p: 4 }}>
        <Stack spacing={3}>
          <Typography variant="h5">Reset Password</Typography>
          {data && <Alert severity="success">{data.message}</Alert>}
          {error && <Alert severity="error">{error.data?.message || 'Reset failed.'}</Alert>}
          <Stack component="form" spacing={2} onSubmit={handleSubmit(onSubmit)}>
            <Controller 
              name="token" 
              control={control} 
              rules={{ required: true }} 
              render={({ field }) => (
                <TextField {...field} label="Reset token" fullWidth />
              )} 
            />
            <Controller 
              name="password" 
              control={control} 
              rules={{ required: true }} 
              render={({ field }) => (
                <TextField {...field} label="New password" type="password" fullWidth />
              )} 
            />
            <Controller 
              name="confirmPassword" 
              control={control} 
              rules={{ required: true }} 
              render={({ field }) => (
                <TextField {...field} label="Confirm password" type="password" fullWidth />
              )} 
            />
            <Button type="submit" variant="contained" disabled={isLoading}>
              {isLoading ? 'Resetting...' : 'Reset password'}
            </Button>
            <Link component={RouterLink} to="/admin/login" underline="hover" align="center">
              Back to login
            </Link>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}