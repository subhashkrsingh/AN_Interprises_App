import { Alert, Button, Paper, Stack, TextField, Typography } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { useState } from 'react';

export default function ChangePassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const { control, handleSubmit, reset } = useForm({ 
    defaultValues: { currentPassword: '', password: '', confirmPassword: '' } 
  });

  const onSubmit = async (values) => {
    setIsLoading(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setData({ message: 'Password updated successfully!' });
      reset();
    } catch (err) {
      setError({ data: { message: 'Password update failed.' } });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 560 }}>
      <Stack spacing={2.5}>
        <Typography variant="h5">Change Password</Typography>
        {data && <Alert severity="success">{data.message}</Alert>}
        {error && <Alert severity="error">{error.data?.message || 'Password update failed.'}</Alert>}
        <Stack component="form" spacing={2} onSubmit={handleSubmit(onSubmit)}>
          <Controller 
            name="currentPassword" 
            control={control} 
            rules={{ required: true }} 
            render={({ field }) => (
              <TextField {...field} label="Current password" type="password" fullWidth />
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
            {isLoading ? 'Updating...' : 'Update password'}
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}