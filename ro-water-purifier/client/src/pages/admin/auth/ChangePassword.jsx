import { Alert, Button, Paper, Stack, TextField, Typography } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { useChangePasswordMutation } from '../../../features/api/adminApi.js';

export default function ChangePassword() {
  const [changePassword, { isLoading, data, error }] = useChangePasswordMutation();
  const { control, handleSubmit, reset } = useForm({ defaultValues: { currentPassword: '', password: '' } });

  const onSubmit = async (values) => {
    await changePassword(values).unwrap();
    reset();
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 560 }}>
      <Stack spacing={2.5}>
        <Typography variant="h5">Change Password</Typography>
        {data && <Alert severity="success">{data.message}</Alert>}
        {error && <Alert severity="error">{error.data?.message || 'Password update failed.'}</Alert>}
        <Stack component="form" spacing={2} onSubmit={handleSubmit(onSubmit)}>
          <Controller name="currentPassword" control={control} rules={{ required: true }} render={({ field }) => <TextField {...field} label="Current password" type="password" />} />
          <Controller name="password" control={control} rules={{ required: true }} render={({ field }) => <TextField {...field} label="New password" type="password" />} />
          <Button type="submit" variant="contained" disabled={isLoading}>
            Update password
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}
